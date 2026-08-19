# Member 1 — Interface Contracts (Frontend ↔ Backend)

This document defines the exact API contracts between your React Frontend (`Member 1`) and the Express REST API (`Member 2`). All specifications are extracted directly from the canonical backend codebase.

---

## 1. Authentication Contracts (`/api/auth`)

### 1.1 Student Registration
- **Endpoint:** `POST /api/auth/register`
- **Auth:** None (Public)
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@student.university.edu",
    "studentId": "STU12345",
    "password": "Password123!"
  }
  ```
- **Response Format (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "data": {
      "id": 10,
      "name": "John Doe",
      "email": "john@student.university.edu",
      "role": "student"
    }
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login`
- **Auth:** None (Public)
- **Request Body:**
  ```json
  {
    "email": "john@student.university.edu",
    "password": "Password123!"
  }
  ```
- **Response Format (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "user": {
        "id": 10,
        "name": "John Doe",
        "email": "john@student.university.edu",
        "role": "student"
      }
    }
  }
  ```

---

## 2. Hostel & Room Contracts (`/api/hostels`, `/api/rooms`)

### 2.1 List Active Hostels
- **Endpoint:** `GET /api/hostels?location=campus`
- **Auth:** None (Public)
- **Response Format (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Sunrise Hall",
        "location": "North Campus",
        "description": "Modern student living with WiFi and study lounges.",
        "amenities": ["WiFi", "Laundry", "Gym"],
        "contact_email": "sunrise@university.edu",
        "contact_phone": "+61 2 9000 1111",
        "total_rooms": 20,
        "available_rooms": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
  ```

### 2.2 Get Hostel Rooms
- **Endpoint:** `GET /api/rooms/hostel/:hostelId`
- **Auth:** None (Public)
- **Response Format (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 101,
        "hostel_id": 1,
        "room_number": "A-101",
        "room_type": "single",
        "capacity": 1,
        "price_per_semester": "1500.00",
        "status": "available",
        "description": "Quiet single room facing garden."
      }
    ]
  }
  ```

---

## 3. Booking Contracts (`/api/bookings`)

### 3.1 Create Booking Request
- **Endpoint:** `POST /api/bookings`
- **Auth:** Bearer Token (`student`)
- **Request Body:**
  ```json
  {
    "roomId": 101,
    "checkInDate": "2026-09-01",
    "checkOutDate": "2027-01-31"
  }
  ```
- **Response Format (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 501,
      "student_id": 10,
      "room_id": 101,
      "hostel_id": 1,
      "check_in_date": "2026-09-01",
      "check_out_date": "2027-01-31",
      "status": "pending",
      "created_at": "2026-08-15T07:00:00Z"
    }
  }
  ```

### 3.2 Upload Payment Receipt
- **Endpoint:** `POST /api/bookings/:id/receipt`
- **Auth:** Bearer Token (`student` owner)
- **Request Headers:** `Content-Type: multipart/form-data`
- **Body Field:** `receipt` (file buffer: `.jpg`, `.png`, `.pdf` ≤ 5MB)
- **Response Format (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "receiptUrl": "https://cloudstay-receipts.s3.ap-southeast-1.amazonaws.com/receipts/501/abc-123.jpg"
    }
  }
  ```

### 3.3 Admin Update Booking Status
- **Endpoint:** `PUT /api/bookings/:id/status`
- **Auth:** Bearer Token (`admin` or `manager`)
- **Request Body:**
  ```json
  {
    "status": "approved",
    "reviewNote": "Payment receipt verified."
  }
  ```
- **Response Format (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 501,
      "status": "approved",
      "reviewed_by": 2,
      "review_note": "Payment receipt verified.",
      "reviewed_at": "2026-08-15T07:30:00Z"
    }
  }
  ```
