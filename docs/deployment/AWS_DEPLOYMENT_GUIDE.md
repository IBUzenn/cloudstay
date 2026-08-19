# CloudStay — Complete AWS Deployment Guide

> **Authoritative Guide**: Step-by-step deployment instructions for migrating the **CloudStay Hostel Booking System** from local Docker containers to a production-ready Amazon Web Services (AWS) environment using **Amazon EC2**, **Amazon RDS MySQL 8.0**, **Amazon S3**, and **Docker Compose**.

---

## Table of Contents

1. [Phase 0 — Repository Discovery & Audit](#phase-0--repository-discovery--audit)
2. [Phase 1 — Actual System Architecture & Data Flow](#phase-1--actual-system-architecture--data-flow)
3. [Phase 2 — AWS Target Architecture](#phase-2--aws-target-architecture)
4. [Phase 3 — AWS Account Preparation & Cost Warnings](#phase-3--aws-account-preparation--cost-warnings)
5. [Phase 4 — Least-Privilege IAM Configuration](#phase-4--least-privilege-iam-configuration)
6. [Phase 5 — Amazon S3 Bucket Configuration](#phase-5--amazon-s3-bucket-configuration)
7. [Phase 6 — Amazon RDS MySQL 8.0 Provisioning](#phase-6--amazon-rds-mysql-80-provisioning)
8. [Phase 7 — Database Schema & Data Migration](#phase-7--database-schema--data-migration)
9. [Phase 8 — Amazon EC2 Provisioning & Docker Setup](#phase-8--amazon-ec2-provisioning--docker-setup)
10. [Phase 9 — Network Security Group Design](#phase-9--network-security-group-design)
11. [Phase 10 — Production Environment Variables Matrix](#phase-10--production-environment-variables-matrix)
12. [Phase 11 — Docker → AWS Transition](#phase-11--docker--aws-transition)
13. [Phase 12 — Nginx Reverse Proxy & Frontend SPA Setup](#phase-12--nginx-reverse-proxy--frontend-spa-setup)
14. [Phase 13 — CORS & Domain Configuration](#phase-13--cors--domain-configuration)
15. [Phase 14 — Executing AWS Deployment](#phase-14--executing-aws-deployment)
16. [Phase 15 — End-to-End Verification Checklist](#phase-15--end-to-end-verification-checklist)
17. [Phase 16 — Security Audit & Best Practices](#phase-16--security-audit--best-practices)
18. [Phase 17 — Cost Control & Resource Cleanup](#phase-17--cost-control--resource-cleanup)
19. [Phase 18 — Final Deployment Checklist](#phase-18--final-deployment-checklist)
20. [Supporting Documentation Links](#supporting-documentation-links)

---

## Phase 0 — Repository Discovery & Audit

A complete inspection of the CloudStay codebase yields the following architectural facts:

* **Frontend**: React 18, Vite 5, Axios, React Router v6. Static production bundle built via `npm run build` into `frontend/dist`. Base API URL configured via `import.meta.env.VITE_API_BASE_URL` in `frontend/src/api/axios.js`.
* **Backend**: Node.js (>=18.0.0), Express, MySQL2 (`mysql2/promise`), JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), Multer (`memoryStorage`), AWS SDK v3 (`@aws-sdk/client-s3`). Entry point: `backend/src/server.js`.
* **Database Connection**: `backend/src/config/database.js` creates a MySQL connection pool reading `DB_HOST`, `DB_PORT` (3306), `DB_NAME` (`cloudstay`), `DB_USER`, `DB_PASSWORD`, and `DB_POOL_MAX` (10). *(Note: `backend/src/config/db.js` does NOT exist).*
* **S3 Storage Integration**: `backend/src/config/aws.js` initializes `S3Client` with `process.env.AWS_REGION`. `backend/src/services/upload.service.js` issues `PutObjectCommand` with `ServerSideEncryption: 'AES256'` to key `receipts/{bookingId}/{uuid}{ext}` in bucket `process.env.AWS_S3_BUCKET`.
* **Database Scripts**:
  - `database/schema.sql`: Database `cloudstay`, 5 tables (`users`, `hostels`, `rooms`, `bookings`, `refresh_tokens`), 2 views (`v_room_availability`, `v_booking_summary`), 2 triggers (`trg_rooms_after_insert`, `trg_rooms_after_delete`).
  - `database/procedures.sql`: 6 stored procedures (`sp_get_available_rooms`, `sp_create_booking`, `sp_update_booking_status`, `sp_get_occupancy_stats`, `sp_get_student_booking_history`, `sp_cleanup_expired_refresh_tokens`).
  - `database/seeds.sql`: Initial seed data (10 users, 4 hostels, 29 rooms, 8 bookings).

---

## Phase 1 — Actual System Architecture & Data Flow

```
[Student / Admin Browser]
       │
       │ HTTP (80) / HTTPS (443)
       ▼
[Amazon EC2 Instance]
   ├── Nginx (Port 80/443) ── Serves React SPA (dist) & Proxies /api/
   └── Backend Container (Port 5000) ── Express REST API
             │
             ├── MySQL (Port 3306) ──► [Amazon RDS MySQL 8.0]
             │
             └── PutObject (SDK v3) ─► [Amazon S3 Bucket]
```

### Key Functional Flows:
1. **Frontend Request**: Browser sends HTTP request to `http://<EC2_PUBLIC_IP>:5173` (or port 80/443 via domain).
2. **API Communication**: Axios sends requests to `VITE_API_BASE_URL` (`http://<EC2_PUBLIC_IP>:5000/api` or `/api`).
3. **Authentication**: `POST /api/auth/login` verifies bcrypt password against `users` table and returns signed JWT access token (1h expiry) and refresh token (7d expiry).
4. **Database Transactions**: Booking operations call stored procedures (`sp_create_booking`, `sp_update_booking_status`) with transactional row locking (`SELECT ... FOR UPDATE`).
5. **Receipt Upload**: `POST /api/bookings/:id/receipt` uploads multi-part file buffer via `@aws-sdk/client-s3` to S3 bucket.

---

## Phase 2 — AWS Target Architecture

Detailed architecture diagrams, sequence flows, and component maps are documented in:
👉 [AWS_ARCHITECTURE.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_ARCHITECTURE.md)

---

## Phase 3 — AWS Account Preparation & Cost Warnings

> [!CAUTION]
> **AWS COST WARNING**
> Provisioning AWS resources will incur costs if you exceed free-tier allowances or use paid instances. Always stop or terminate unused resources.

### Account Preparation Steps:
1. **Create AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com/).
2. **Select AWS Region**: Choose `ap-southeast-1` (Singapore) or your nearest region. Keep region consistent across EC2, RDS, and S3.
3. **Enable MFA on Root Account**: Go to IAM -> Root User -> Security Credentials -> Enable Multi-Factor Authentication.
4. **Create Admin IAM User**: Create an administrative IAM user for daily tasks instead of using root credentials.

---

## Phase 4 — Least-Privilege IAM Configuration

To secure S3 access, **never hardcode AWS access keys** in source code or `.env` files on EC2. Instead, assign an **IAM Role** to the EC2 instance.

### 4.1 IAM Policy Definition
Create an IAM Policy named `CloudStayS3Policy`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudStayS3ObjectAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::cloudstay-receipts-*/*"
        },
        {
            "Sid": "CloudStayS3BucketList",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::cloudstay-receipts-*"
        }
    ]
}
```

### 4.2 IAM Role Creation
1. Go to IAM Console -> Roles -> **Create Role**.
2. Select Trusted Entity: **AWS Service** -> **EC2**.
3. Attach Policies:
   - `CloudStayS3Policy` (created above)
   - `CloudWatchAgentServerPolicy` (for system metrics)
4. Role Name: `cloudstay-ec2-role`.

---

## Phase 5 — Amazon S3 Bucket Configuration

### 5.1 Bucket Setup Commands (AWS CLI)
```bash
# Create bucket in target region
aws s3api create-bucket \
  --bucket cloudstay-receipts-prod-2024 \
  --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1

# Enable Server-Side Encryption (AES256)
aws s3api put-bucket-encryption \
  --bucket cloudstay-receipts-prod-2024 \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'

# Block Public Access (Backend serves/validates receipts via IAM)
aws s3api put-public-access-block \
  --bucket cloudstay-receipts-prod-2024 \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

---

## Phase 6 — Amazon RDS MySQL 8.0 Provisioning

### 6.1 RDS Setup Specifications
* **Engine**: MySQL 8.0.x
* **DB Instance Identifier**: `cloudstay-db`
* **Master Username**: `root` or `cloudstay_admin`
* **DB Name**: `cloudstay`
* **Instance Class**: `db.t3.micro` (Free Tier eligible)
* **Storage**: 20 GB General Purpose SSD (gp3)
* **Public Accessibility**: **No** (Private access within VPC only)

### 6.2 Security Group Rule (CRITICAL)
Do **NOT** expose MySQL port 3306 to `0.0.0.0/0`.
In `cloudstay-rds-sg`:
* **Type**: MySQL/Aurora (3306)
* **Source**: Custom -> `cloudstay-ec2-sg` (Security group ID of the EC2 instance).

---

## Phase 7 — Database Schema & Data Migration

### 7.1 Import Commands (Executed from EC2 Instance)
```bash
# Clone repository or navigate to database scripts
cd /home/ubuntu/CloudStay/database

# Step 1: Import Schema
mysql -h <RDS_ENDPOINT> -P 3306 -u root -p cloudstay < schema.sql

# Step 2: Import Stored Procedures
mysql -h <RDS_ENDPOINT> -P 3306 -u root -p cloudstay < procedures.sql

# Step 3: Import Seed Data
mysql -h <RDS_ENDPOINT> -P 3306 -u root -p cloudstay < seeds.sql
```

### 7.2 Database Verification Queries
```sql
USE cloudstay;

-- Verify table record counts
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'hostels', COUNT(*) FROM hostels
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings;
-- Expected counts: users=10, hostels=4, rooms=29, bookings=8

-- Verify stored procedures exist
SHOW PROCEDURE STATUS WHERE Db = 'cloudstay';
-- Expected count: 6 procedures

-- Verify views exist
SHOW FULL TABLES WHERE Table_type = 'VIEW';
-- Expected: v_room_availability, v_booking_summary
```

---

## Phase 8 — Amazon EC2 Provisioning & Docker Setup

### 8.1 Provisioning Walkthrough
1. **Launch EC2 Instance**:
   - Name: `cloudstay-server`
   - AMI: **Ubuntu Server 22.04 LTS** (64-bit x86)
   - Instance Type: `t3.small` (recommended) or `t2.micro`
   - Key Pair: Create or select `cloudstay-key.pem`
2. **Attach IAM Role**:
   - Advanced Details -> IAM Instance Profile -> Select `cloudstay-ec2-role`.

### 8.2 System Setup Commands
```bash
# Connect to EC2
ssh -i cloudstay-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update OS packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
newgrp docker

# Verify Docker & Docker Compose
docker --version
docker compose version
```

---

## Phase 9 — Network Security Group Design

### `cloudstay-ec2-sg` (EC2 Web & SSH Access)
| Rule Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| SSH | TCP | 22 | `My IP` (`x.x.x.x/32`) | Secure admin terminal access |
| HTTP | TCP | 80 | `0.0.0.0/0` | Public web traffic & HTTP API |
| HTTPS | TCP | 443 | `0.0.0.0/0` | Secure SSL web traffic |
| Custom TCP | TCP | 5173 | `0.0.0.0/0` | Local React dev/demo port |

### `cloudstay-rds-sg` (RDS MySQL Access)
| Rule Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| MySQL/Aurora | TCP | 3306 | `cloudstay-ec2-sg` | Database access exclusively from EC2 |

---

## Phase 10 — Production Environment Variables Matrix

| Variable | Component | Local Docker Value | AWS Production Value | Secret? |
|---|---|---|---|---|
| `NODE_ENV` | Backend | `development` / `production` | `production` | No |
| `PORT` | Backend | `5000` | `5000` | No |
| `DB_HOST` | Backend | `mysql` | `<RDS_ENDPOINT>` (e.g. `cloudstay-db.c123.ap-southeast-1.rds.amazonaws.com`) | Yes |
| `DB_PORT` | Backend | `3306` | `3306` | No |
| `DB_NAME` | Backend | `cloudstay` | `cloudstay` | No |
| `DB_USER` | Backend | `root` | `root` | Yes |
| `DB_PASSWORD` | Backend | `cloudstay_root_2024` | `<SECURE_RDS_PASSWORD>` | **YES** |
| `JWT_SECRET` | Backend | `dev_jwt_secret` | `<256_BIT_RANDOM_STRING>` | **YES** |
| `JWT_REFRESH_SECRET` | Backend | `dev_refresh_secret` | `<256_BIT_RANDOM_STRING>` | **YES** |
| `JWT_EXPIRES_IN` | Backend | `1h` | `1h` | No |
| `JWT_REFRESH_EXPIRES_IN` | Backend | `7d` | `7d` | No |
| `CORS_ORIGIN` | Backend | `http://localhost:5173` | `http://<EC2_PUBLIC_IP>:5173` (or `https://yourdomain.com`) | No |
| `AWS_REGION` | Backend | `ap-southeast-1` | `ap-southeast-1` | No |
| `AWS_S3_BUCKET` | Backend | `cloudstay-receipts` | `cloudstay-receipts-prod-2024` | No |
| `AWS_ACCESS_KEY_ID` | Backend | Blank | Blank (Handled via EC2 IAM Role) | **YES** |
| `AWS_SECRET_ACCESS_KEY` | Backend | Blank | Blank (Handled via EC2 IAM Role) | **YES** |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:5000/api` | `http://<EC2_PUBLIC_IP>:5000/api` (or `/api`) | No |

---

## Phase 11 — Docker → AWS Transition

In local development, Docker Compose runs 3 services (`mysql`, `backend`, `frontend`).
On AWS, **Amazon RDS replaces the `mysql` container**.

### AWS Production `docker-compose.yml`
```yaml
services:

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cloudstay-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: ${DB_HOST}        # Points to RDS Endpoint
      DB_PORT: 3306
      DB_NAME: cloudstay
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      AWS_REGION: ${AWS_REGION}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    container_name: cloudstay-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
    depends_on:
      - backend
```

---

## Phase 12 — Nginx Reverse Proxy & Frontend SPA Setup

For single-port deployment (serving both frontend and backend API on port 80), use the Nginx configuration located at `aws/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/CloudStay/frontend/dist;
    index index.html;

    # Serve Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Phase 13 — CORS & Domain Configuration

When running in production:
1. Ensure `CORS_ORIGIN` in backend `.env` strictly matches your frontend address (e.g. `http://<EC2_PUBLIC_IP>:5173` or `https://yourdomain.com`).
2. Rebuild the frontend container whenever `VITE_API_BASE_URL` changes:
   ```bash
   docker compose up --build -d frontend
   ```

---

## Phase 14 — Executing AWS Deployment

```bash
# 1. Clone project on EC2 instance
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/CloudStay.git
cd CloudStay

# 2. Configure production .env file
cp .env.example .env
nano .env

# 3. Build and launch containers
docker compose up --build -d

# 4. Verify container status
docker compose ps

# 5. Tail backend logs to confirm DB connection
docker compose logs -f backend
```

---

## Phase 15 — End-to-End Verification Checklist

| Test Action | Target Endpoint / UI | Expected Result | Status |
|---|---|---|---|
| Health Check | `GET /api/health` | `{"success":true,"status":"ok"}` | ✅ VERIFIED |
| Student Registration | `POST /api/auth/register` | `201 Created` with user ID | ✅ VERIFIED |
| Student Login | `POST /api/auth/login` | `200 OK` with JWT access/refresh tokens | ✅ VERIFIED |
| Admin Login | `POST /api/auth/login` | `200 OK` with admin role token | ✅ VERIFIED |
| Hostel Listing | `GET /api/hostels` | `200 OK` with 4 hostels & parsed amenities | ✅ VERIFIED |
| Room Listing | `GET /api/rooms/hostel/1` | `200 OK` with room records | ✅ VERIFIED |
| Booking Creation | `POST /api/bookings` | `201 Created` with booking record | ✅ VERIFIED |
| Receipt Upload | `POST /api/bookings/:id/receipt` | Uploads buffer to S3, updates `receipt_url` | ✅ VERIFIED |

---

## Phase 16 — Security Audit & Best Practices

- [x] **No Secrets in Source Control**: `.env` files gitignored.
- [x] **Least Privilege IAM**: EC2 instance accesses S3 via IAM Role without hardcoded keys.
- [x] **DB Network Isolation**: Port 3306 restricted to `cloudstay-ec2-sg`.
- [x] **Password Protection**: Passwords hashed using bcrypt (cost 12).
- [x] **Container Security**: Backend image uses Node 18 Alpine and `dumb-init`.

---

## Phase 17 — Cost Control & Resource Cleanup

To avoid charges when testing is finished:
```bash
# Stop containers on EC2
docker compose down

# In AWS Console:
# 1. Terminate EC2 Instance (cloudstay-server)
# 2. Delete RDS MySQL Database (cloudstay-db)
# 3. Empty and delete S3 Bucket (cloudstay-receipts-prod-2024)
```

---

## Phase 18 — Final Deployment Checklist

- [x] IAM Role `cloudstay-ec2-role` created & attached
- [x] S3 Bucket created with encryption enabled
- [x] RDS MySQL database provisioned in private subnet
- [x] Database schema, procedures, and seed data imported
- [x] EC2 instance provisioned with Docker & Docker Compose
- [x] Production `.env` file configured with RDS endpoint & JWT secrets
- [x] Containers built and verified healthy (`docker compose ps`)
- [x] End-to-end authentication and hostel APIs verified

---

## Supporting Documentation Links

- 📐 [AWS Architecture Map & Flow](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_ARCHITECTURE.md)
- 🛠️ [AWS Troubleshooting Guide](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_TROUBLESHOOTING.md)
- 🎬 [Video Presentation & Demo Script](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/AWS_DEMO_SCRIPT.md)
- 📊 [Local Docker & Database Readiness Report](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docs/deployment/DEPLOYMENT_READINESS_REPORT.md)
