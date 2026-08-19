# CloudStay — Technology Justification

## 1. Frontend: React 18 + Vite 5

| Factor | Justification |
|---|---|
| **Component-based architecture** | Enables reusable UI components (BookingCard, HostelList, etc.) that reduce duplication |
| **Vite build tool** | 10–100× faster HMR vs Create React App; native ESM; production builds with Rollup |
| **React ecosystem** | Mature ecosystem: React Router, React Query, Axios, Formik all readily available |
| **Industry standard** | Widely used in industry — maximises learning transferability |
| **SPA routing** | Client-side routing provides seamless navigation without full page reloads |

**Alternatives considered:**  
- Next.js — SSR adds unnecessary complexity for a student project with no SEO requirements  
- Vue.js — smaller ecosystem; less relevant for employment market  
- Angular — steep learning curve; overkill for project scope  

---

## 2. Backend: Node.js 18 + Express.js 4

| Factor | Justification |
|---|---|
| **JavaScript across stack** | Same language frontend & backend reduces cognitive overhead for team |
| **Non-blocking I/O** | Handles concurrent booking requests efficiently without threading complexity |
| **Express.js** | Minimal, un-opinionated framework — full control over architecture |
| **npm ecosystem** | Vast middleware library: multer (file upload), express-validator, helmet, morgan |
| **JSON-native** | Seamless data exchange between layers without serialisation friction |

**Alternatives considered:**  
- Django / FastAPI — Python is fine, but adds language context-switching  
- Spring Boot — Java overhead excessive for team size and timeline  

---

## 3. Database: MySQL 8.0 on Amazon RDS

| Factor | Justification |
|---|---|
| **Relational integrity** | Booking ↔ Room ↔ Hostel ↔ User relationships demand referential integrity (FKs, constraints) |
| **ACID compliance** | Critical for financial-adjacent booking transactions |
| **Amazon RDS** | Managed service — automated backups, patches, multi-AZ option; no DBA burden on team |
| **MySQL familiarity** | Team has prior exposure; reduces onboarding time |
| **Stored procedures** | Useful for complex booking availability queries |

**Alternatives considered:**  
- PostgreSQL — equally valid, less team familiarity  
- MongoDB — document model poorly suited to relational booking data  
- SQLite — not suitable for cloud multi-instance deployment  

---

## 4. Authentication: JWT + bcrypt

| Factor | Justification |
|---|---|
| **Stateless JWT** | No session store required; scales horizontally across EC2 instances |
| **bcrypt hashing** | Industry standard; adaptive cost factor; resistant to brute-force |
| **Role-based access** | JWT payload carries role (student/admin/manager) — enforced in middleware |
| **Short-lived tokens** | Access tokens expire in 1h; refresh tokens in 7d |

---

## 5. AWS Services

| Service | Purpose | Justification |
|---|---|---|
| **EC2** | Application host | Full control over OS, runtime, Nginx config |
| **RDS (MySQL)** | Managed database | Automated backups, security patches, isolated subnet |
| **S3** | Payment receipt storage | Durable, cheap, presigned URL support for secure upload |
| **IAM** | Access control | Least-privilege roles; EC2 instance role avoids key embedding |
| **CloudWatch** | Monitoring & logs | Native AWS log aggregation; alarms for error spikes |
| **Security Groups** | Network firewall | Stateful rules: only 80/443 public, 3306 restricted to EC2 CIDR |

---

## 6. Supporting Tools

| Tool | Purpose |
|---|---|
| **Nginx** | Reverse proxy; serves frontend static build; SSL termination |
| **PM2** | Node.js process manager; auto-restart, cluster mode, log management |
| **GitHub Actions** | CI/CD pipeline — lint, test, deploy on push to `main` |
| **Swagger / OpenAPI** | Auto-generated interactive API docs |
| **dotenv** | Environment variable management across environments |
