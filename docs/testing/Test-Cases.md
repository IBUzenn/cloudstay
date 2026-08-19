# CloudStay — Test Cases Specification

## 1. Authentication Test Cases
- **TC-AUTH-01**: Student registration with valid details returns 201 Created.
- **TC-AUTH-02**: Student registration with weak password returns 422 Unprocessable Entity.
- **TC-AUTH-03**: Registration with existing email/student ID returns 409 Conflict.
- **TC-AUTH-04**: Login with valid credentials returns 200 OK and JWT access/refresh tokens.
- **TC-AUTH-05**: Login with invalid password returns 401 Unauthorized.

## 2. Authorization Test Cases
- **TC-SEC-01**: Accessing `/api/bookings/my` without `Authorization` header returns 401 Unauthorized.
- **TC-SEC-02**: Student user accessing `/api/bookings` (all bookings) returns 403 Forbidden.
- **TC-SEC-03**: Student accessing another student's booking ID returns 403 Forbidden.
- **TC-SEC-04**: Auth responses exclude `password_hash` fields.

## 3. Hostels & Rooms Test Cases
- **TC-HST-01**: `GET /api/hostels` returns paginated list of active hostels with 200 OK.
- **TC-HST-02**: `GET /api/hostels?location=Campus` filters hostels by keyword.
- **TC-HST-03**: `GET /api/hostels/:id` returns hostel detail and room availability.
- **TC-HST-04**: `GET /api/hostels/999` returns 404 Not Found.

## 4. Bookings & Receipts Test Cases
- **TC-BKG-01**: `POST /api/bookings` with valid room ID creates pending booking (201 Created).
- **TC-BKG-02**: `POST /api/bookings` when student already has pending booking returns 409 Conflict.
- **TC-UPL-01**: Uploading valid JPEG receipt (2MB) returns 200 OK and S3 URL.
- **TC-UPL-02**: Uploading `.exe` file returns 400 Bad Request (invalid file type).
- **TC-UPL-03**: Uploading 6MB file returns 400 Bad Request (file size limit).
- **TC-UPL-04**: S3 outage triggers 502 Bad Gateway response.
