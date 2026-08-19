# CloudStay — Docker Architecture

## Inspection Findings (Pre-Implementation)

### Repository Structure

```
CloudStay/
├── backend/                     Node.js / Express API
│   ├── src/
│   │   ├── server.js            Entry point (node src/server.js)
│   │   ├── config/
│   │   │   ├── app.js           Express app, CORS, routes, swagger
│   │   │   ├── database.js      mysql2/promise pool (reads env vars)
│   │   │   └── aws.js           S3Client (optional credentials)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   │   └── logger.js        Winston — writes to logs/ directory
│   │   └── validators/
│   ├── tests/
│   │   ├── integration/         Supertest integration tests
│   │   └── unit/                Jest unit tests
│   ├── package.json             engines: node >=18.0.0
│   ├── Dockerfile               (pre-existing, replaced)
│   └── ecosystem.config.js      PM2 config (not used in Docker)
│
├── frontend/                    React 18 + Vite
│   ├── src/
│   │   └── api/
│   │       ├── axios.js         Axios instance (uses VITE_API_BASE_URL)
│   │       └── index.js         API function exports
│   ├── vite.config.js           Dev proxy: /api → localhost:5000
│   └── package.json
│
├── database/
│   ├── schema.sql               Tables, triggers, views
│   ├── procedures.sql           Stored procedures
│   └── seeds.sql                Seed users, hostels, rooms, bookings
│
└── aws/                         AWS deployment scripts (pre-existing)
    ├── nginx.conf
    └── setup-ec2.sh
```

---

## Environment Variable Analysis

### Backend Required Variables

| Variable | Source | Notes |
|---|---|---|
| `NODE_ENV` | Compose env | `production` in Docker |
| `PORT` | Compose env | 5000 |
| `DB_HOST` | **Compose env** | **Must be `mysql` in Docker, NOT `localhost`** |
| `DB_PORT` | Compose env | 3306 |
| `DB_NAME` | Compose env | cloudstay |
| `DB_USER` | Compose env | root |
| `DB_PASSWORD` | Compose env | From `MYSQL_ROOT_PASSWORD` |
| `DB_POOL_MAX` | Compose env | 10 |
| `JWT_SECRET` | `.env` / secret | 256-bit random string |
| `JWT_REFRESH_SECRET` | `.env` / secret | 256-bit random string |
| `JWT_EXPIRES_IN` | Compose env | 1h |
| `JWT_REFRESH_EXPIRES_IN` | Compose env | 7d |
| `CORS_ORIGIN` | Compose env | `http://localhost:5173` |
| `LOG_LEVEL` | Compose env | info/debug |
| `AWS_REGION` | `.env` | Optional |
| `AWS_ACCESS_KEY_ID` | `.env` | Optional — S3 upload only |
| `AWS_SECRET_ACCESS_KEY` | `.env` | Optional — S3 upload only |
| `AWS_S3_BUCKET` | `.env` | Optional — S3 upload only |

### Frontend Build-Time Variable

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Browser-facing — must use `localhost`, not Docker service name |

### MySQL Container Variables

| Variable | Value |
|---|---|
| `MYSQL_ROOT_PASSWORD` | From `.env` |
| `MYSQL_DATABASE` | `cloudstay` |

---

## Critical Observations

### 1. DB_HOST Must Be "mysql" in Docker

`backend/src/config/database.js` reads:
```js
host: process.env.DB_HOST,
```

Inside Docker, `localhost` refers to the backend container itself, not MySQL.
The MySQL service must be referenced by its Compose service name: `mysql`.

**This would silently fail if not corrected.**

### 2. VITE_API_BASE_URL Must Remain localhost

`frontend/src/api/axios.js` reads:
```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

This value is baked into the JavaScript bundle at **build time**.
The browser (on the host machine) cannot resolve Docker service names.
Therefore the URL must be `http://localhost:5000/api`, not `http://backend:5000/api`.

### 3. CORS Configuration

`backend/src/config/app.js`:
```js
origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
```

For local Docker, `CORS_ORIGIN=http://localhost:5173` is correct because
both the browser and the frontend container's mapped port are at localhost:5173.

### 4. Logger Writes to Filesystem

`backend/src/utils/logger.js` writes to `logs/error.log` and `logs/combined.log`.
The backend Dockerfile creates this directory with `RUN mkdir -p logs`.
In Docker, these logs are ephemeral unless a volume is mounted.

### 5. SQL Files and MySQL Docker Init

MySQL Docker initialization reads scripts from `/docker-entrypoint-initdb.d/`.
Files must be mounted there. Scripts run **alphabetically**.

The SQL files use `DELIMITER $$` for triggers and stored procedures.
MySQL Docker's init process runs scripts with the standard mysql client,
which **does support** `DELIMITER`. No modification needed.

**Important:** Init scripts run ONLY when the volume is first created.
To reinitialize: `docker compose down -v && docker compose up --build`

### 6. AWS S3

`backend/src/config/aws.js` gracefully handles missing credentials:
```js
...(process.env.AWS_ACCESS_KEY_ID && {
  credentials: { accessKeyId: ..., secretAccessKey: ... }
})
```

The S3Client is created without credentials if `AWS_ACCESS_KEY_ID` is not set.
Receipt upload will fail at runtime if S3 is not configured,
but the application will start and all other features will work.

### 7. Existing Backend Dockerfile

The pre-existing `backend/Dockerfile` was minimal:
- Used `node:18` (full image, ~1GB)
- Used `npm install` (not `npm ci`)
- No `.dockerignore`
- No signal handling (SIGTERM)
- No separation of dev/prod dependencies

Replaced with a production-grade Dockerfile using:
- `node:18-alpine` (smaller)
- `dumb-init` (proper signal forwarding)
- `npm ci --omit=dev` (reproducible, prod-only deps)

---

## Docker Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  HOST MACHINE                                                    │
│                                                                  │
│  Browser → http://localhost:5173  (frontend)                     │
│  Browser → http://localhost:5000  (backend API)                  │
│  DB Tool → localhost:3306         (MySQL — for debugging)        │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Port mapping
         ┌─────────▼──────────────────────────────────────────┐
         │  Docker Network: cloudstay-network (bridge)        │
         │                                                    │
         │  ┌──────────────────┐   ┌─────────────────────┐  │
         │  │  frontend        │   │  backend             │  │
         │  │  nginx:80        │   │  node:5000           │  │
         │  │  host: 5173:80   │   │  host: 5000:5000     │  │
         │  └──────────────────┘   └──────────┬──────────┘  │
         │                                    │              │
         │                         mysql:3306 │              │
         │                         ┌──────────▼──────────┐  │
         │                         │  mysql               │  │
         │                         │  MySQL 8.0:3306      │  │
         │                         │  host: 3306:3306     │  │
         │                         │  vol: mysql_data     │  │
         │                         └─────────────────────┘  │
         └───────────────────────────────────────────────────┘
```

---

## Database Initialization Order

MySQL init scripts are prefixed to control execution order:

| File | Purpose |
|---|---|
| `01-schema.sql` | Creates database, tables, triggers, views |
| `02-procedures.sql` | Creates stored procedures |
| `03-seeds.sql` | Inserts test data |

---

## Files Created

| File | Purpose |
|---|---|
| `CloudStay/docker-compose.yml` | Orchestrates all 3 services |
| `CloudStay/.env.example` | Template for docker-compose vars |
| `CloudStay/.env` | Local dev values (gitignored) |
| `backend/Dockerfile` | Production Node.js image (replaced) |
| `backend/.dockerignore` | Build context exclusions |
| `frontend/Dockerfile` | Multi-stage Vite → Nginx image |
| `frontend/.dockerignore` | Build context exclusions |
| `frontend/nginx.conf` | SPA routing + gzip |
| `docs/deployment/DOCKER_ARCHITECTURE.md` | This document |

---

## Start / Stop Commands

```bash
# Start everything (build images first)
docker compose up --build

# Start in background
docker compose up --build -d

# Stop (preserves database volume)
docker compose down

# FULL RESET (deletes database volume — reinitializes on next up)
docker compose down -v
docker compose up --build

# View logs
docker compose logs -f backend
docker compose logs -f mysql
docker compose logs -f frontend

# Check container status
docker compose ps
```

---

## Verify Database

```bash
# Enter MySQL container
docker exec -it cloudstay-mysql mysql -u root -pcloudstay_root_2024

# Inside MySQL:
SHOW DATABASES;
USE cloudstay;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM hostels;
SELECT COUNT(*) FROM rooms;
SELECT COUNT(*) FROM bookings;
SHOW PROCEDURE STATUS WHERE Db = 'cloudstay';
SHOW FULL TABLES WHERE Table_type = 'VIEW';
SHOW TRIGGERS FROM cloudstay;
```

---

## Backend API Verification

```bash
# Health check
curl http://localhost:5000/api/health

# Hostel listing (public)
curl http://localhost:5000/api/hostels

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cloudstay.edu","password":"Admin@1234"}'
```
