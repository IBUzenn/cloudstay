# CloudStay Presentation Script — Member 4: DevOps & Cloud Infrastructure Engineer

> **Speaker**: Member 4 (DevOps & Cloud Infrastructure Engineer)  
> **Duration**: ~3.5 to 4 minutes  
> **Focus**: Docker Compose Orchestration, AWS Architecture (EC2, RDS, S3), Nginx Reverse Proxy, IAM Least-Privilege Roles, and GitHub Actions CI/CD Pipeline

---

## 🎙️ Spoken Presentation Script

### 1. Introduction & Docker Containerization (0:00 - 0:45)
"Thank you, Member 3. My name is Member 4, and I served as the DevOps and Cloud Infrastructure Engineer for CloudStay.

My goal was ensuring that CloudStay could be started with a single command locally using Docker, while providing a seamless, secure migration path to AWS cloud infrastructure.

Our local environment uses **Docker Compose** (`docker-compose.yml`) to orchestrate three containerized services:
1. `cloudstay-mysql`: Uses official `mysql:8.0` image with a named volume `mysql_data` for data persistence.
2. `cloudstay-backend`: Built from `backend/Dockerfile` using `node:18-alpine` and `dumb-init` for proper OS signal handling.
3. `cloudstay-frontend`: Uses a **multi-stage build** in `frontend/Dockerfile`. Stage 1 compiles our React app using `vite build`. Stage 2 copies the static `dist/` bundle into `nginx:1.27-alpine`. The final image contains zero Node.js overhead—only ultra-fast Nginx static file serving."

---

### 2. AWS Cloud Architecture & Storage Integration (0:45 - 1:45)
"When moving from local Docker to AWS production, we transition from local MySQL containers to managed cloud services:

```
User Browser ──► EC2 (Nginx + Express) ──► RDS MySQL (Private Subnet)
                                       └──► S3 Bucket (Receipt Storage)
```

- **Amazon EC2**: Runs an Ubuntu 22.04 LTS instance hosting our containerized frontend and Express API.
- **Amazon RDS MySQL 8.0**: Hosts our production relational database in a private subnet. The database port 3306 is restricted exclusively to requests coming from our EC2 security group (`cloudstay-ec2-sg`).
- **Amazon S3 (`cloudstay-receipts`)**: Payment receipts uploaded by students are sent directly to S3 via `@aws-sdk/client-s3` in `upload.service.js`. All objects are encrypted at rest using server-side AES256 encryption.
- **IAM Role (`cloudstay-ec2-role`)**: Instead of hardcoding AWS keys in code, our EC2 instance authenticates to S3 using an IAM Role and Instance Profile. This enforces the security principle of **least privilege**."

---

### 3. Nginx Proxy & CI/CD Automation (1:45 - 2:45)
"In `frontend/nginx.conf` and `aws/nginx.conf`, Nginx acts as our web server and reverse proxy:
- `location /`: Serves static React assets with `try_files $uri $uri/ /index.html` to support HTML5 client-side routing.
- `location /api/`: Proxies backend REST traffic to `http://127.0.0.1:5000/api/`, terminating SSL and hiding internal port details.

For Continuous Integration, we authored `.github/workflows/ci.yml`. On every push to `main` or `development`, GitHub Actions automatically:
1. Runs `actions/checkout@v4` and `actions/setup-node@v4`.
2. Restores cached dependencies via `cache-dependency-path`.
3. Executes backend Jest tests (`npm test`).
4. Executes the Vite production build (`npm run build`)."

---

### 4. Screen Demonstration Instructions & Handoff (2:45 - 3:45)
*[Action on Screen: Terminal running `docker compose ps` and `curl -s http://localhost:5000/api/health`]*

"Let me demonstrate our container orchestration live.

Running `docker compose ps` shows all three containers: `cloudstay-mysql` is Healthy, `cloudstay-backend` is Up on port 5000, and `cloudstay-frontend` is Up on port 5173.

Executing `curl http://localhost:5000/api/health` returns `200 OK` with status `ok` and uptime metrics.

A complete infrastructure setup requires rigorous automated testing and documentation verification.

I will now hand over to **Member 5**, our Quality Assurance & Documentation Specialist, who will walk through our test suite, coverage reports, and user manual documentation."

---

## 📋 Member 4 Quick Reference

- **Key Files**: [`docker-compose.yml`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/docker-compose.yml), [`backend/Dockerfile`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/Dockerfile), [`frontend/Dockerfile`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/frontend/Dockerfile), [`.github/workflows/ci.yml`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/.github/workflows/ci.yml), [`backend/src/services/upload.service.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/backend/src/services/upload.service.js)
- **Key Concepts**: Multi-stage Docker build, AWS EC2 + RDS + S3 architecture, Nginx reverse proxy, EC2 IAM role least privilege, GitHub Actions CI/CD.
- **Screen Focus**: Terminal showing `docker compose ps` status and health endpoint `curl` check.
