# Member 3 — Setup Instructions

## 1. Required Software

- **MySQL Server**: `v8.0` or higher
- **MySQL Client / Workbench**: `v8.0`
- **Node.js**: `v18.x` (for testing `config/database.js`)

---

## 2. Directory Scope

Your work is scoped exclusively to:
```
CloudStay/database/
CloudStay/backend/src/config/database.js
CloudStay/docs/design/er-diagram.md
```

---

## 3. Environment Variables

Create `.env` (or pass parameters to MySQL CLI):

```env
# Local Database Configuration (Placeholders)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_db_password
DB_NAME=cloudstay
```

> **Security Note:** NEVER commit real production database passwords or AWS RDS credentials.

---

## 4. Database Setup Commands

Run the following commands in terminal from `CloudStay/`:

### 1. Execute Schema Creation DDL
```bash
mysql -u root -p < database/schema.sql
```

### 2. Execute Stored Procedures
```bash
mysql -u root -p cloudstay < database/procedures.sql
```

### 3. Load Development Seed Data
```bash
mysql -u root -p cloudstay < database/seeds.sql
```

---

## 5. Verification Steps

1. Log into MySQL CLI:
   ```bash
   mysql -u root -p cloudstay
   ```
2. Verify all tables created:
   ```sql
   SHOW TABLES;
   -- Output should include: users, hostels, rooms, bookings, refresh_tokens
   ```
3. Verify view execution:
   ```sql
   SELECT * FROM v_room_availability LIMIT 5;
   ```
4. Verify trigger functionality:
   ```sql
   SELECT id, total_rooms FROM hostels WHERE id = 1;
   ```
