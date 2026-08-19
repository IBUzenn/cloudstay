# CloudStay — AWS Production Deployment Report

**Date:** 2026-08-19  
**Deployed by:** DevOps Agent  
**Repository:** https://github.com/IBUzenn/cloudstay  
**Production URL:** http://13.212.173.242  
**AWS Region:** ap-southeast-1 (Singapore)  

---

## 1. Infrastructure Summary

| Resource | Name | Details |
|----------|------|---------|
| EC2 Instance | `cloudstay-server` | `t3.small`, Ubuntu 22.04, AMI: ami-0672fd5b9210e2f22, IP: `13.212.173.242` |
| RDS MySQL | `cloudstay-db` | MySQL 8.0, `db.t3.micro`, Single-AZ, endpoint: `cloudstay-db.c7ieyuos8ezi.ap-southeast-1.rds.amazonaws.com` |
| S3 Bucket | `cloudstay-receipts-382163917883` | AES-256 SSE, public access blocked, `ap-southeast-1` |
| IAM Role | `cloudstay-ec2-role` | Attached to EC2; grants `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` on the receipts bucket |
| IAM Policy | `CloudStayS3Policy` | Least-privilege S3 access to receipts bucket only |
| Instance Profile | `cloudstay-ec2-profile` | Linked to IAM role; mounted on EC2 for credential auto-detection |
| Security Group (EC2) | `cloudstay-ec2-sg` | Inbound: 80/tcp (HTTP), 22/tcp (SSH) |
| Security Group (RDS) | `cloudstay-rds-sg` | Inbound: 3306/tcp from `cloudstay-ec2-sg` only |

### Architecture Diagram

```
Internet
    │
    ▼
EC2 t3.small (13.212.173.242)
├── Docker Container: cloudstay-frontend (Nginx, port 80)
│   ├── Serves: React SPA (Vite build, dist/)
│   └── Proxy: /api/* → cloudstay-backend:5000
└── Docker Container: cloudstay-backend (Node.js, port 5000 internal)
    ├── JWT authentication
    ├── Express REST API
    ├── AWS SDK v3 (S3 uploads, uses IAM role credentials)
    └── MySQL connection → RDS cloudstay-db:3306
                              │
                         AWS RDS MySQL 8.0
                         (cloudstay-receipts S3 ← AWS SDK)
```

---

## 2. Production Configuration Files Created

### `frontend/nginx.prod.conf`
Nginx proxy config routing `/api` traffic to the backend container:
```nginx
location /api/ {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}
```

### `frontend/Dockerfile.prod`
Multi-stage Docker build: Node 18-Alpine builder → Nginx 1.27-Alpine runtime.  
Build args: `VITE_API_BASE_URL=/api` (baked into bundle).

### `docker-compose.prod.yml`
Orchestrates `backend` + `frontend` containers on a dedicated `cloudstay-prod-network`.  
Does **NOT** include a MySQL container (uses RDS instead).

---

## 3. Database Initialization

All SQL files applied to RDS in order:

| File | Status | Records Created |
|------|--------|-----------------|
| `database/schema.sql` | ✅ Applied | 5 tables, 2 views |
| `database/procedures.sql` | ✅ Applied | 6 stored procedures |
| `database/seeds.sql` | ✅ Applied | 10 users, 4 hostels, 29 rooms, 8 bookings |

**Verified table counts:**

| Table | Count |
|-------|-------|
| users | 10 |
| hostels | 4 |
| rooms | 29 |
| bookings | 8 |
| refresh_tokens | 0 |

**Stored Procedures:** sp_cleanup_expired_refresh_tokens, sp_create_booking, sp_get_available_rooms, sp_get_occupancy_stats, sp_get_student_booking_history, sp_update_booking_status

**Views:** v_booking_summary, v_room_availability  
**Triggers:** trg_rooms_after_insert, trg_rooms_after_delete

---

## 4. Bug Fixes Applied During Deployment

### 4.1 Express Trust Proxy (Critical — Blocked all API routes)
**File:** `backend/src/config/app.js`  
**Error:** `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` — express-rate-limit threw a ValidationError on every request because Nginx adds `X-Forwarded-For` headers but Express `trust proxy` was `false`.  
**Fix:** Added `app.set('trust proxy', 1)` when `NODE_ENV === 'production'`.  
**Commit:** `bcf2748`

### 4.2 AdminDashboard React Error #31 (Critical — Crashed admin page)
**File:** `frontend/src/pages/admin/AdminDashboard.jsx`  
**Error:** Backend `/api/admin/stats` returns `rooms` and `bookings` as objects (`{total, available, booked}`) not scalars. Rendering objects directly in JSX causes React Error #31 ("Objects are not valid as React children").  
**Fix:** Used optional chaining `stats.rooms?.total ?? stats.rooms` and `stats.bookings?.total ?? stats.bookings`.  
**Commit:** `6550b9a`

### 4.3 AdminDashboard Incorrect Field Names (Minor — Empty stat cards)
**File:** `frontend/src/pages/admin/AdminDashboard.jsx`  
**Issue:** Dashboard referenced `stats.users` but API returns `stats.students`. `stats.hostels` does not exist in the API response.  
**Fix:** Updated labels and field names to match actual API structure.  
**Commit:** `cfdc762`

---

## 5. End-to-End Verification Results

### API Verification

| Endpoint | Method | Expected | Result |
|----------|--------|----------|--------|
| `/api/health` | GET | 200 OK | ✅ 200 `{"success":true,"status":"ok"}` |
| `/api/hostels` | GET | 200 with data | ✅ 200 — 4 hostels returned |
| `/api/auth/login` (admin) | POST | 200 + JWT | ✅ 200 — access + refresh tokens issued |
| `/api/auth/login` (student) | POST | 200 + JWT | ✅ 200 |
| `/api/admin/stats` | GET (auth) | 200 + stats | ✅ 200 — rooms:29, bookings:8, students:7 |
| `/api/bookings` | GET (auth) | 200 | ✅ 200 |

### Browser E2E Verification

| Test | Result | Evidence |
|------|--------|---------|
| Homepage loads with hostel list | ✅ Pass | 4 hostels visible: Blue Block, Excellence Annex, Green Block, Unity Hall |
| React SPA routing works | ✅ Pass | Navigated to `/hostels`, `/login`, `/admin`, `/dashboard` |
| Admin login (admin@cloudstay.edu) | ✅ Pass | JWT issued, redirected to `/admin` |
| Admin dashboard stats display | ✅ Pass | Total Rooms: 29, Total Bookings: 8 |
| Student login (abena.mensah@student.edu) | ✅ Pass | JWT issued, redirected to `/dashboard` |
| Student dashboard shows bookings | ✅ Pass | Booking #8 (Cancelled), Booking #1 (Approved) |
| No localhost:5000 in JS bundle | ✅ Pass | 0 references — all API calls via `/api` proxy |
| No JavaScript errors | ✅ Pass | Clean console in all pages after fix |

### Database Connected from Container
```
2026-08-19 15:35:39 [info]: Database connected: cloudstay-db.c7ieyuos8ezi.ap-southeast-1.rds.amazonaws.com:3306/cloudstay
2026-08-19 15:35:39 [info]: CloudStay API running on port 5000 [production]
```

---

## 6. Seed Credentials (Test Accounts)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cloudstay.edu | Admin@1234 |
| Manager | manager.blueblock@cloudstay.edu | Admin@1234 |
| Manager | manager.greenblock@cloudstay.edu | Admin@1234 |
| Student | abena.mensah@student.edu | Student@1234 |
| Student | kwame.owusu@student.edu | Student@1234 |
| Student | ama.darko@student.edu | Student@1234 |

---

## 7. Deployment Commands Reference

### SSH to EC2
```bash
ssh -i cloudstay-deploy-key ubuntu@13.212.173.242
```

### Redeploy (pull + rebuild + restart)
```bash
cd /home/ubuntu/cloudstay
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Rebuild single service
```bash
docker compose -f docker-compose.prod.yml build backend
docker compose -f docker-compose.prod.yml up -d --no-deps backend
```

### View logs
```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Check database
```bash
mysql -h cloudstay-db.c7ieyuos8ezi.ap-southeast-1.rds.amazonaws.com -u cloudstay_admin -p cloudstay
```

---

## 8. Security Notes

- `.env` file: Stored at `/home/ubuntu/cloudstay/.env` with `chmod 600` (owner-only read)
- `.env` is in `.gitignore` — **never committed to GitHub**
- RDS password: Alphanumeric + `*` special character, 24+ chars
- EC2 SSH: Ed25519 keypair, permanently stored in `~/.ssh/authorized_keys`
- RDS access: Restricted to EC2 security group only (port 3306 not internet-exposed)
- S3 credentials: Auto-detected from IAM instance profile — **no static keys in code or env**
- JWT secrets: 64+ character random strings in `.env` only

---

## 9. Known Limitations (Non-Blocking)

- **Node.js version**: Backend runs Node 18.20.8; AWS SDK v3 recommends Node ≥ 22. Functional now but upgrade recommended before January 2027.
- **No HTTPS**: HTTP only. Production use requires SSL certificate via Nginx + Let's Encrypt or ACM (no Load Balancer provisioned per requirements).
- **Single-AZ RDS**: No Multi-AZ for cost savings. Acceptable for this deployment scope.
- **No NAT Gateway**: EC2 is in a public subnet; RDS is in a private subnet group. Per requirements, no NAT gateway.

---

## 10. Git Commit History (Deployment-Related)

| Commit | Message |
|--------|---------|
| `4b0bbb6` | feat(deployment): add production AWS Docker Compose configuration |
| `bcf2748` | fix(backend): enable trust proxy for production Nginx deployment |
| `6550b9a` | fix(frontend): fix AdminDashboard crash when stats.rooms/bookings are objects |
| `cfdc762` | fix(frontend): align AdminDashboard with actual /api/admin/stats response |
