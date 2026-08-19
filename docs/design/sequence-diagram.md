# CloudStay — Sequence Diagrams

## SD-01: User Registration

```mermaid
sequenceDiagram
    actor Student
    participant FE as React Frontend
    participant API as Express API
    participant MW as Validate Middleware
    participant SVC as Auth Service
    participant DB as MySQL RDS

    Student->>FE: Fill registration form & submit
    FE->>API: POST /api/auth/register\n{name, email, studentId, password}
    API->>MW: Validate request body
    MW-->>API: Validation result
    alt Validation fails
        API-->>FE: 422 Unprocessable Entity\n{errors: [...]}
        FE-->>Student: Show field errors
    else Validation passes
        API->>SVC: register(name, email, studentId, password)
        SVC->>DB: SELECT user WHERE email = ?
        DB-->>SVC: result
        alt Email already exists
            SVC-->>API: throw ConflictError
            API-->>FE: 409 Conflict\n{message: "Email already registered"}
            FE-->>Student: Show email error
        else Email is new
            SVC->>SVC: bcrypt.hash(password, 12)
            SVC->>DB: INSERT INTO users (...)
            DB-->>SVC: insertId
            SVC-->>API: {userId, email}
            API-->>FE: 201 Created\n{message: "Registration successful"}
            FE-->>Student: Redirect to Login page
        end
    end
```

---

## SD-02: User Login & JWT Issuance

```mermaid
sequenceDiagram
    actor Student
    participant FE as React Frontend
    participant API as Express API
    participant SVC as Auth Service
    participant DB as MySQL RDS

    Student->>FE: Enter email & password
    FE->>API: POST /api/auth/login\n{email, password}
    API->>SVC: login(email, password)
    SVC->>DB: SELECT user WHERE email = ?
    DB-->>SVC: user record
    alt User not found
        SVC-->>API: throw UnauthorizedError
        API-->>FE: 401 Unauthorized
        FE-->>Student: Invalid credentials
    else User found
        SVC->>SVC: bcrypt.compare(password, hash)
        alt Password mismatch
            SVC-->>API: throw UnauthorizedError
            API-->>FE: 401 Unauthorized
            FE-->>Student: Invalid credentials
        else Password correct
            SVC->>SVC: jwt.sign({userId, role}, SECRET, {expiresIn: '1h'})
            SVC->>SVC: jwt.sign({userId}, REFRESH_SECRET, {expiresIn: '7d'})
            SVC-->>API: {accessToken, refreshToken, user}
            API-->>FE: 200 OK\n{accessToken, refreshToken, user}
            FE->>FE: Store tokens in localStorage
            FE-->>Student: Redirect to Dashboard
        end
    end
```

---

## SD-03: Create Booking

```mermaid
sequenceDiagram
    actor Student
    participant FE as React Frontend
    participant API as Express API
    participant AuthMW as Auth Middleware
    participant SVC as Booking Service
    participant DB as MySQL RDS

    Student->>FE: Select room & submit booking form
    FE->>API: POST /api/bookings\n{roomId, checkIn, checkOut}\nAuthorization: Bearer <JWT>
    API->>AuthMW: Verify JWT
    AuthMW->>AuthMW: jwt.verify(token, SECRET)
    alt Token invalid / expired
        AuthMW-->>API: throw UnauthorizedError
        API-->>FE: 401 Unauthorized
        FE-->>Student: Redirect to Login
    else Token valid
        AuthMW-->>API: req.user = {userId, role}
        API->>SVC: createBooking(userId, roomId, checkIn, checkOut)
        SVC->>DB: SELECT room WHERE id = ? FOR UPDATE
        DB-->>SVC: room record
        alt Room not available
            SVC-->>API: throw ConflictError
            API-->>FE: 409 Conflict
            FE-->>Student: Room no longer available
        else Room available
            SVC->>DB: SELECT active booking WHERE student_id = ?
            DB-->>SVC: result
            alt Active booking exists
                SVC-->>API: throw ConflictError
                API-->>FE: 409 Conflict\nYou already have an active booking
                FE-->>Student: Show error
            else No active booking
                SVC->>DB: INSERT INTO bookings\n(studentId, roomId, status=pending, ...)
                DB-->>SVC: bookingId
                SVC-->>API: booking object
                API-->>FE: 201 Created\n{booking}
                FE-->>Student: Dashboard — Pending booking
            end
        end
    end
```

---

## SD-04: Upload Payment Receipt to S3

```mermaid
sequenceDiagram
    actor Student
    participant FE as React Frontend
    participant API as Express API
    participant AuthMW as Auth Middleware
    participant UMW as Upload Middleware
    participant USVC as Upload Service
    participant S3 as AWS S3
    participant DB as MySQL RDS

    Student->>FE: Select receipt file & submit
    FE->>API: POST /api/bookings/:id/receipt\nmultipart/form-data\nAuthorization: Bearer <JWT>
    API->>AuthMW: Verify JWT
    AuthMW-->>API: req.user attached
    API->>UMW: Multer filter + size limit
    UMW->>UMW: Check file type (JPEG/PNG/PDF)
    UMW->>UMW: Check file size ≤ 5MB
    alt File rejected
        UMW-->>API: throw ValidationError
        API-->>FE: 400 Bad Request
        FE-->>Student: Invalid file
    else File accepted
        UMW-->>API: file buffer in memory
        API->>USVC: uploadReceipt(bookingId, fileBuffer, mimetype)
        USVC->>USVC: Generate unique S3 key\nreceipts/{bookingId}/{uuid}.ext
        USVC->>S3: s3.putObject({Bucket, Key, Body, ContentType})
        S3-->>USVC: {ETag, Location}
        USVC->>DB: UPDATE bookings SET receipt_url = ? WHERE id = ?
        DB-->>USVC: OK
        USVC-->>API: {receiptUrl}
        API-->>FE: 200 OK\n{receiptUrl}
        FE-->>Student: Receipt uploaded successfully
    end
```

---

## SD-05: Admin Approves Booking

```mermaid
sequenceDiagram
    actor Admin
    participant FE as React Frontend
    participant API as Express API
    participant AuthMW as Auth Middleware
    participant RoleMW as Role Middleware
    participant SVC as Booking Service
    participant DB as MySQL RDS

    Admin->>FE: Click Approve on booking
    FE->>API: PUT /api/bookings/:id/status\n{status: "approved"}\nAuthorization: Bearer <JWT>
    API->>AuthMW: Verify JWT
    AuthMW-->>API: req.user = {userId, role: "admin"}
    API->>RoleMW: checkRole(["admin","manager"])
    RoleMW-->>API: Allowed
    API->>SVC: updateBookingStatus(bookingId, "approved", adminId)
    SVC->>DB: BEGIN TRANSACTION
    DB-->>SVC: OK
    SVC->>DB: UPDATE bookings SET status = "approved" WHERE id = ?
    DB-->>SVC: OK
    SVC->>DB: UPDATE rooms SET status = "booked"\nWHERE id = booking.room_id
    DB-->>SVC: OK
    SVC->>DB: COMMIT
    DB-->>SVC: OK
    SVC-->>API: updated booking
    API-->>FE: 200 OK\n{booking}
    FE-->>Admin: Dashboard refreshes — Approved
```
