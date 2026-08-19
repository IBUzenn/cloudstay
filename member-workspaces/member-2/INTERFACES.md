# Member 2 — Interface Contracts (Backend Integrations)

This document specifies the integration contracts between your Express REST API (`Member 2`) and the Database (`Member 3`), AWS Storage (`Member 4`), and Frontend (`Member 1`).

---

## 1. Database Integration Contracts (`Member 2 ↔ Member 3`)

### 1.1 Connection Pool (`backend/src/config/database.js`)
- **Driver:** `mysql2/promise`
- **Pool Settings:** `waitForConnections: true, connectionLimit: 10, queueLimit: 0`
- **Tables Consumed:**
  - `users`: `(id, name, email, student_id, password_hash, role, is_active)`
  - `hostels`: `(id, name, location, description, amenities, total_rooms, is_active)`
  - `rooms`: `(id, hostel_id, room_number, room_type, capacity, price_per_semester, status)`
  - `bookings`: `(id, student_id, room_id, hostel_id, check_in_date, check_out_date, status, receipt_url, reviewed_by)`
  - `refresh_tokens`: `(id, user_id, token_hash, expires_at)`

---

## 2. AWS S3 Storage Integration Contracts (`Member 2 ↔ Member 4`)

### 2.1 File Upload Service (`backend/src/services/upload.service.js`)
- **SDK:** `@aws-sdk/client-s3` (`PutObjectCommand`)
- **Bucket:** `process.env.S3_BUCKET` (`cloudstay-receipts`)
- **Upload Flow:**
  - Input: `bookingId`, file `buffer`, `mimetype` (`image/jpeg`, `image/png`, `application/pdf`)
  - Key Pattern: `receipts/${bookingId}/${uuidv4()}.${ext}`
  - Encryption: `ServerSideEncryption: 'AES256'`
- **Output URL Format:**
  `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`

---

## 3. Frontend API Contracts (`Member 2 ↔ Member 1`)

### 3.1 Standard Response Envelopes

#### Success Envelope (`sendSuccess` in `utils/response.js`)
```json
{
  "success": true,
  "message": "Optional message",
  "data": { }
}
```

#### Paginated Envelope (`sendPaginated` in `utils/response.js`)
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Operational Error Envelope (`errorHandler` in `middleware/error.middleware.js`)
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [ ]
}
```

---

## 4. HTTP Status Code Specification

| Status Code | Meaning | Usage |
|---|---|---|
| `200 OK` | Success | Successful GET, PUT, DELETE operations |
| `201 Created` | Created | Successful POST creation (registration, booking creation) |
| `400 Bad Request` | Bad Request | Validation errors or unsupported file formats |
| `401 Unauthorized` | Unauthorized | Missing, invalid, or expired JWT token |
| `403 Forbidden` | Forbidden | Authenticated user lacks required role (e.g., student calling admin route) |
| `404 Not Found` | Not Found | Resource ID does not exist in database |
| `409 Conflict` | Conflict | Duplicate account, double booking, or invalid state transition |
| `429 Too Many Requests` | Rate Exceeded | Global or auth rate limit exceeded |
| `500 Internal Server Error` | Server Error | Unhandled server exception |
