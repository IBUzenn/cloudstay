# Member 2 — Setup Instructions

## 1. Required Software

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MySQL Client**: Optional (for direct query testing)

---

## 2. Directory Scope

Your work is scoped exclusively to:
```
CloudStay/backend/
```

---

## 3. Dependencies & Installation

Open terminal in `CloudStay/backend` and run:

```bash
cd CloudStay/backend
npm install
```

Installed core dependencies:
- `express` (web framework)
- `jsonwebtoken` (JWT authentication)
- `bcryptjs` (password hashing)
- `express-validator` (input validation)
- `express-rate-limit` (rate limiting)
- `helmet`, `cors`, `compression`, `morgan` (security & utility middleware)
- `mysql2` (MySQL database pool)

---

## 4. Environment Variables

Create `.env` in `CloudStay/backend/`:

```env
# Backend Environment Configuration (Placeholders)
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database Connection (Local or Mock)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=cloudstay

# JWT Secrets (Local Development Placeholders)
JWT_SECRET=dev_jwt_secret_key_change_in_production_12345
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_key_change_in_production_67890
JWT_REFRESH_EXPIRES_IN=7d

# AWS Config (Local Dev Placeholders)
AWS_REGION=ap-southeast-1
S3_BUCKET=cloudstay-receipts-dev
```

> **Security Note:** NEVER commit real production secrets or database credentials into `.env`.

---

## 5. Execution Commands

### Start Backend Development Server (with nodemon)
```bash
npm run dev
```
*Server will start at:* `http://localhost:5000`

### Start Backend Production Mode
```bash
npm start
```

### Run Unit and Integration Tests
```bash
npm test
```

---

## 6. Verification Steps

1. Run `npm run dev` and ensure console outputs `CloudStay API running on port 5000`.
2. Send a `GET http://localhost:5000/api/health` request using curl or browser.
3. Confirm JSON response:
   ```json
   {
     "success": true,
     "status": "ok",
     "timestamp": "...",
     "uptime": 1.23,
     "version": "1.0.0"
   }
   ```
