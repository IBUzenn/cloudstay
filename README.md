# ☁️ CloudStay — Student Hostel Booking System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-ff9900.svg)](https://aws.amazon.com/)

> A cloud-native hostel booking platform built for university students. Browse, book, pay, and track room reservations — all containerized and ready for single-command deployment.

---

## 📌 Problem Statement

Students face significant friction when searching for and reserving hostel accommodation. Manual processes, lack of real-time availability, and poor payment tracking create delays and errors for both students and hostel managers.

## 💡 Solution

**CloudStay** is a full-stack, dockerized web application that enables:

- **Students** — register, search hostels, view real-time available rooms, book rooms, upload payment receipts to S3, and track booking status.
- **Hostel Managers** — manage room inventory, review applications, and approve or reject student bookings.
- **System Administrators** — full platform oversight, user status management, and occupancy reporting via stored procedures and views.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite 5 + Axios + React Router v6 | Single Page Application (SPA) |
| **Backend API** | Node.js 18 + Express.js 4 + Winston | RESTful API Server & Logging |
| **Database** | MySQL 8.0 (InnoDB, Views, Stored Procedures, Triggers) | Relational Storage & Business Logic |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs (Cost 12) | Stateless Auth & Password Hashing |
| **File Storage** | AWS S3 (`@aws-sdk/client-s3`) | Payment Receipt Object Storage |
| **Containerization** | Docker + Docker Compose + Nginx 1.27 Alpine | Isolated Multi-Container Runtime |
| **Cloud Infrastructure** | AWS EC2 + Amazon RDS MySQL 8.0 + Amazon S3 | Cloud Production Deployment |
| **Process Control** | `dumb-init` (Docker) / PM2 (EC2) | Signal Handling & Cluster Management |

---

## 🏛️ Architecture Overview

```
LOCAL DOCKER ENVIRONMENT:
Browser (Host Machine)
   │
   ├── GET http://localhost:5173  ────────► [cloudstay-frontend] (Nginx on port 80)
   │
   └── POST/GET http://localhost:5000 ────► [cloudstay-backend] (Express REST API)
                                                 │
                                                 │ DB_HOST=mysql:3306 (Docker Bridge)
                                                 ▼
                                           [cloudstay-mysql] (MySQL 8.0)
                                                 │
                                                 ▼
                                           mysql_data (Persistent Named Volume)

AWS PRODUCTION ENVIRONMENT:
User Browser
   │ HTTPS (443) / HTTP (80)
   ▼
[Amazon EC2 Instance]
   ├── Nginx Proxy (Port 80) ── Serves React Static Bundle (dist) & Proxies /api/
   └── Express API Container ── REST API on localhost:5000
             │
             ├── MySQL (Port 3306) ──► [Amazon RDS MySQL 8.0] (Private Subnet)
             │
             └── PutObject (SDK v3) ─► [Amazon S3 Bucket] (Receipt Storage)
```

---

## 🚀 Quick Start (Local Docker Setup)

The entire multi-container stack can be built and launched with a single command.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+ / Compose v2+) installed and running.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORGANIZATION/CloudStay.git
cd CloudStay
```

### 2. Configure Environment Variables

Copy the safe `.env.example` template to `.env`:

```bash
cp .env.example .env
```

### 3. Start the Containers

```bash
docker compose up --build
```

Docker Compose will build the backend (Node 18 Alpine) and frontend (Vite static build → Nginx), start MySQL 8.0, and execute database initialization scripts automatically.

### 4. Access the Application

- **Frontend Application**: `http://localhost:5173`
- **Backend API Health Check**: `http://localhost:5000/api/health`
- **Hostel Listings API**: `http://localhost:5000/api/hostels`

### 5. Stop or Reset the Application

```bash
# Stop containers (preserves database data)
docker compose down

# FULL RESET (drops volume and re-runs SQL initialization scripts)
docker compose down -v
docker compose up --build
```

---

## 🔑 Pre-Seeded Accounts

The database initializes automatically with test accounts (passwords hashed via bcrypt):

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@cloudstay.edu` | `Admin@1234` | System Administrator |
| **Manager** | `manager.blueblock@cloudstay.edu` | `Admin@1234` | Hostel Manager (Blue Block) |
| **Manager** | `manager.greenblock@cloudstay.edu` | `Admin@1234` | Hostel Manager (Green Block) |
| **Student** | `abena.mensah@student.edu` | `Student@1234` | Student Account |
| **Student** | `kwame.owusu@student.edu` | `Student@1234` | Student Account |

---

## 🗄️ Database Initialization

MySQL 8.0 initializes automatically on first container launch via mounted SQL scripts:

1. `database/schema.sql` — Creates database `cloudstay`, 5 tables (`users`, `hostels`, `rooms`, `bookings`, `refresh_tokens`), 2 triggers, and 2 views (`v_room_availability`, `v_booking_summary`).
2. `database/procedures.sql` — Creates 6 stored procedures (`sp_get_available_rooms`, `sp_create_booking`, `sp_update_booking_status`, `sp_get_occupancy_stats`, `sp_get_student_booking_history`, `sp_cleanup_expired_refresh_tokens`).
3. `database/seeds.sql` — Seeds 10 users, 4 hostels, 29 rooms, and 8 initial bookings.

---

## 🧪 Testing & Quality Assurance

CloudStay includes 33 unit and integration tests covering API endpoints, JWT authentication, stored procedures, and role-based permissions.

```bash
# Run backend Jest test suite
cd backend
npm test

# Run tests with code coverage report
npm run test:coverage
```

### Test Suite Execution Summary
- **Test Suites**: 8 passed, 8 total
- **Tests**: 33 passed, 33 total
- **Pass Rate**: 100%

---

## 📋 Key REST API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health & uptime check |
| `POST` | `/api/auth/register` | Public | Register new student user |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `POST` | `/api/auth/refresh` | Public | Refresh expired JWT access token |
| `GET` | `/api/hostels` | Public | List hostels with room availability |
| `GET` | `/api/rooms/hostel/:hostelId` | Public | List rooms for a specific hostel |
| `POST` | `/api/bookings` | Student | Create booking (atomic stored proc) |
| `POST` | `/api/bookings/:id/receipt` | Student | Upload payment receipt to S3 |
| `GET` | `/api/bookings/my` | Student | Retrieve student's booking history |
| `GET` | `/api/bookings` | Admin/Manager | List all bookings |
| `PUT` | `/api/bookings/:id/status` | Admin/Manager | Approve or reject booking |
| `GET` | `/api/admin/stats` | Admin | Occupancy & hostel statistics |

---

## 🌐 AWS Production Deployment

CloudStay is prepared for production deployment on Amazon Web Services using **EC2**, **Amazon RDS MySQL 8.0**, and **Amazon S3**.

Detailed deployment documentation is available in `docs/deployment/`:

- 📖 **Master AWS Deployment Guide**: [`docs/deployment/AWS_DEPLOYMENT_GUIDE.md`](docs/deployment/AWS_DEPLOYMENT_GUIDE.md)
- 📐 **AWS Architecture Map**: [`docs/deployment/AWS_ARCHITECTURE.md`](docs/deployment/AWS_ARCHITECTURE.md)
- 🛠️ **AWS Troubleshooting Matrix**: [`docs/deployment/AWS_TROUBLESHOOTING.md`](docs/deployment/AWS_TROUBLESHOOTING.md)
- 🎬 **Video Presentation Script**: [`docs/deployment/AWS_DEMO_SCRIPT.md`](docs/deployment/AWS_DEMO_SCRIPT.md)
- 📊 **Deployment Readiness Report**: [`docs/deployment/DEPLOYMENT_READINESS_REPORT.md`](docs/deployment/DEPLOYMENT_READINESS_REPORT.md)
- 🛠️ **Git Repository Report**: [`docs/deployment/GIT_REPOSITORY_REPORT.md`](docs/deployment/GIT_REPOSITORY_REPORT.md)

---

## 👥 Member Responsibilities & Team Organization

CloudStay is an academic group project developed by a five-member team:

- **Member Responsibilities Document**: [`docs/contributions/MEMBER_CONTRIBUTIONS.md`](docs/contributions/MEMBER_CONTRIBUTIONS.md)

---

## 📜 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
