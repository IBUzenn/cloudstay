# CloudStay — Activity Diagrams

## AD-01: Student Registration & Login Flow

```mermaid
flowchart TD
    A([Start]) --> B[Navigate to Register Page]
    B --> C[Fill Registration Form\nname, email, studentId, password]
    C --> D{Input Valid?}
    D -- No --> E[Display Field Errors]
    E --> C
    D -- Yes --> F[POST /api/auth/register]
    F --> G{Email Already\nRegistered?}
    G -- Yes --> H[Display: Email already exists]
    H --> C
    G -- No --> I[Hash Password with bcrypt]
    I --> J[Save User to DB\nrole = student]
    J --> K[Return 201 Created]
    K --> L[Redirect to Login Page]
    L --> M[Enter Email & Password]
    M --> N[POST /api/auth/login]
    N --> O{Credentials\nValid?}
    O -- No --> P[Display: Invalid credentials]
    P --> M
    O -- Yes --> Q[Generate JWT Access Token\n1h expiry]
    Q --> R[Generate Refresh Token\n7d expiry]
    R --> S[Store tokens in\nlocalStorage/memory]
    S --> T[Redirect to Student Dashboard]
    T --> Z([End])
```

---

## AD-02: Room Booking Flow

```mermaid
flowchart TD
    A([Start]) --> B[Browse Hostel Listing]
    B --> C[Select Hostel]
    C --> D[View Room List]
    D --> E{Room Available?}
    E -- No --> F[Display: Room Unavailable]
    F --> D
    E -- Yes --> G[Select Room]
    G --> H[Fill Booking Form\ncheck-in, check-out dates]
    H --> I{Form Valid?}
    I -- No --> J[Show Validation Errors]
    J --> H
    I -- Yes --> K[POST /api/bookings]
    K --> L{Student Has\nActive Booking?}
    L -- Yes --> M[Return 409 Conflict Error]
    M --> N([End - Error])
    L -- No --> O[Create Booking Record\nstatus = pending]
    O --> P[Return Booking ID]
    P --> Q[Redirect to Dashboard]
    Q --> R[Display Pending Booking]
    R --> Z([End])
```

---

## AD-03: Payment Receipt Upload Flow

```mermaid
flowchart TD
    A([Start]) --> B[Open Booking Detail\nfrom Dashboard]
    B --> C[Click Upload Receipt]
    C --> D[Select File\nJPEG / PNG / PDF]
    D --> E{File Size\n≤ 5MB?}
    E -- No --> F[Display: File too large]
    F --> D
    E -- Yes --> G{File Type\nValid?}
    G -- No --> H[Display: Invalid file type]
    H --> D
    G -- Yes --> I[POST /api/bookings/:id/receipt\nmultipart/form-data]
    I --> J[Multer validates file]
    J --> K[Upload to AWS S3\nwith unique key]
    K --> L{Upload\nSuccessful?}
    L -- No --> M[Return 500 Upload Error]
    M --> N([End - Error])
    L -- Yes --> O[Save S3 URL to\nbooking.receipt_url]
    O --> P[Return 200 Success]
    P --> Q[Display: Receipt uploaded]
    Q --> Z([End])
```

---

## AD-04: Admin Booking Approval Flow

```mermaid
flowchart TD
    A([Start]) --> B[Admin Logs In]
    B --> C[Navigate to Bookings Panel]
    C --> D[Filter Bookings by\nstatus = pending]
    D --> E[Select a Booking]
    E --> F[View Booking Details]
    F --> G{Receipt\nUploaded?}
    G -- No --> H[Display Warning:\nNo receipt uploaded]
    H --> I{Admin\nDecision?}
    G -- Yes --> J[View Receipt from S3]
    J --> I
    I -- Approve --> K[PUT /api/bookings/:id/status\nbody: approved]
    I -- Reject --> L[PUT /api/bookings/:id/status\nbody: rejected]
    K --> M[Update booking.status = approved]
    M --> N[Update room.status = booked]
    N --> O[Return 200 OK]
    L --> P[Update booking.status = rejected]
    P --> Q[Return 200 OK]
    O --> R[Dashboard refreshes\nBooking shows Approved]
    Q --> R
    R --> Z([End])
```

---

## AD-05: Admin Hostel Management Flow

```mermaid
flowchart TD
    A([Start]) --> B[Admin Navigates to\nHostel Management]
    B --> C{Action?}
    C -- Create --> D[Fill Hostel Form\nname, location, amenities]
    D --> E{Form Valid?}
    E -- No --> F[Show Errors]
    F --> D
    E -- Yes --> G[POST /api/hostels]
    G --> H[Save to DB]
    H --> I[Return 201 Created]
    I --> J[Hostel appears\nin listing]

    C -- Edit --> K[Click Edit on Hostel]
    K --> L[Update Form Fields]
    L --> M[PUT /api/hostels/:id]
    M --> N[Update DB Record]
    N --> O[Return 200 OK]

    C -- Delete --> P[Click Delete]
    P --> Q{Confirm\nDeletion?}
    Q -- No --> B
    Q -- Yes --> R[DELETE /api/hostels/:id]
    R --> S{Active Bookings\nExist?}
    S -- Yes --> T[Return 409:\nCannot delete with\nactive bookings]
    S -- No --> U[Soft-delete hostel\nstatus = inactive]
    U --> V[Return 200 OK]

    J --> Z([End])
    O --> Z
    V --> Z
    T --> Z
```
