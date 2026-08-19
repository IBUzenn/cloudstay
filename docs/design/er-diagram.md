# CloudStay — Entity Relationship Diagram

## ER Diagram (Crow's Foot Notation)

```mermaid
erDiagram
    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar student_id UK
        varchar password_hash
        enum role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    HOSTELS {
        int id PK
        varchar name
        varchar location
        text description
        text amenities
        varchar contact_email
        varchar contact_phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    ROOMS {
        int id PK
        int hostel_id FK
        varchar room_number
        enum room_type
        int capacity
        decimal price_per_semester
        enum status
        text description
        timestamp created_at
        timestamp updated_at
    }

    BOOKINGS {
        int id PK
        int student_id FK
        int room_id FK
        int hostel_id FK
        date check_in_date
        date check_out_date
        enum status
        varchar receipt_url
        int reviewed_by FK
        text review_note
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ BOOKINGS : "places"
    HOSTELS ||--o{ ROOMS : "contains"
    ROOMS ||--o{ BOOKINGS : "reserved in"
    HOSTELS ||--o{ BOOKINGS : "belongs to"
    USERS ||--o{ BOOKINGS : "reviews"
```

---

## Relationship Descriptions

| Relationship | Cardinality | Description |
|---|---|---|
| USERS → BOOKINGS (places) | One-to-Many | One student can have many bookings (one active at a time) |
| USERS → BOOKINGS (reviews) | One-to-Many | One admin/manager can review many bookings |
| HOSTELS → ROOMS | One-to-Many | One hostel contains many rooms |
| HOSTELS → BOOKINGS | One-to-Many | One hostel has many bookings (denormalised FK for query performance) |
| ROOMS → BOOKINGS | One-to-Many | One room can have many booking records over time |

---

## Enum Value Definitions

### USERS.role
| Value | Description |
|---|---|
| `student` | Regular student — can browse and book |
| `manager` | Hostel manager — can approve/reject |
| `admin` | Full system access |

### ROOMS.room_type
| Value | Description |
|---|---|
| `single` | Single occupancy room |
| `double` | Double occupancy room |
| `triple` | Triple occupancy room |
| `suite` | Premium suite |

### ROOMS.status
| Value | Description |
|---|---|
| `available` | Room is open for booking |
| `booked` | Room has an approved booking |
| `maintenance` | Room temporarily unavailable |

### BOOKINGS.status
| Value | Description |
|---|---|
| `pending` | Awaiting admin review |
| `approved` | Booking confirmed |
| `rejected` | Booking denied by admin |
| `cancelled` | Cancelled by student |
