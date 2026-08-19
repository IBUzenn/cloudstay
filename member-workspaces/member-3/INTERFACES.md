# Member 3 — Interface Contracts (Database Schema & Pool)

This document defines the interface contracts between your Database Schema / Connection Pool (`Member 3`) and the Backend API (`Member 2`) and Cloud Infrastructure (`Member 4`).

---

## 1. Relational Schema Contracts (`Member 3 ↔ Member 2`)

### 1.1 `users` Table
```sql
CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    student_id    VARCHAR(50)  NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('student','manager','admin') NOT NULL DEFAULT 'student',
    is_active     TINYINT(1) NOT NULL DEFAULT 1,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 1.2 `hostels` Table
```sql
CREATE TABLE hostels (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    location      VARCHAR(255) NOT NULL,
    description   TEXT NULL,
    amenities     JSON NULL, -- JSON array of strings e.g. ["WiFi","Laundry"]
    contact_email VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    total_rooms   INT UNSIGNED NOT NULL DEFAULT 0, -- Managed by trigger
    is_active     TINYINT(1) NOT NULL DEFAULT 1,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 1.3 `rooms` Table
```sql
CREATE TABLE rooms (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hostel_id          INT UNSIGNED NOT NULL,
    room_number        VARCHAR(20) NOT NULL,
    room_type          ENUM('single','double','triple','suite') NOT NULL DEFAULT 'single',
    capacity           TINYINT UNSIGNED NOT NULL DEFAULT 1,
    price_per_semester DECIMAL(10,2) NOT NULL,
    status             ENUM('available','booked','maintenance') NOT NULL DEFAULT 'available',
    description        TEXT NULL,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
```

### 1.4 `bookings` Table
```sql
CREATE TABLE bookings (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id     INT UNSIGNED NOT NULL,
    room_id        INT UNSIGNED NOT NULL,
    hostel_id      INT UNSIGNED NOT NULL,
    check_in_date  DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status         ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
    receipt_url    VARCHAR(1000) NULL,
    reviewed_by    INT UNSIGNED NULL,
    review_note    TEXT NULL,
    reviewed_at    TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (room_id)    REFERENCES rooms(id),
    FOREIGN KEY (hostel_id)  REFERENCES hostels(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_booking_dates CHECK (check_out_date > check_in_date)
);
```

---

## 2. Views & Stored Procedures

### 2.1 View `v_room_availability`
- **Output Columns:** `room_id`, `room_number`, `room_type`, `capacity`, `price_per_semester`, `status`, `room_description`, `hostel_id`, `hostel_name`, `hostel_location`, `hostel_amenities`
- **Filter:** `WHERE r.status = 'available' AND h.is_active = 1`

### 2.2 View `v_booking_summary`
- **Output Columns:** `booking_id`, `status`, `check_in_date`, `check_out_date`, `receipt_url`, `review_note`, `reviewed_at`, `student_id`, `student_name`, `student_email`, `student_number`, `room_id`, `room_number`, `room_type`, `price_per_semester`, `hostel_id`, `hostel_name`, `reviewed_by_name`

---

## 3. Database Cloud Connection (`Member 3 ↔ Member 4`)

### 3.1 Connection Specification
- **Engine:** MySQL 8.0 (Amazon RDS db.t3.micro)
- **Port:** 3306
- **Subnet Placement:** Private Subnet (10.0.2.0/24)
- **Security Group Rule:** Accepts port 3306 strictly from EC2 Security Group (`SG-EC2`).
