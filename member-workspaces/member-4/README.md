# CloudStay — Member 4 Workspace Package
## Role: DevOps & Cloud Infrastructure Engineer

Welcome to the **Member 4 Workspace Package**. This package contains everything required to understand, execute, test, and hand off your assigned work for the CloudStay Student Hostel Booking System.

---

## 1. Role & Project Objectives

- **Primary Role:** DevOps & Cloud Infrastructure Engineer
- **Core Objectives:**
  - Architect and provision AWS Cloud Infrastructure (`aws/`) in `ap-southeast-1` (VPC, EC2 t3.micro, RDS MySQL 8.0, S3 bucket `cloudstay-receipts`).
  - Configure EC2 IAM Instance Roles with least-privilege S3 (`cloudstay-s3-policy`) and CloudWatch (`cloudstay-cw-policy`) policies.
  - Implement Nginx reverse proxy configuration (`aws/nginx/nginx.conf`) for SSL termination and static asset serving.
  - Set up PM2 process manager and deployment shell scripts (`aws/setup-ec2.sh`, `aws/deploy.sh`).
  - Author and maintain the automated GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`).
  - Configure CloudWatch log groups (`/cloudstay/app`) and 5xx error alarms (`aws/cloudwatch-config.json`).

---

## 2. Responsibilities & Boundaries

### What You Must Work On
- `aws/` (`deploy.sh`, `setup-ec2.sh`, `cloudwatch-config.json`, `nginx/nginx.conf`, IAM policies, Security Groups)
- `.github/workflows/ci.yml` (GitHub Actions workflow file)
- `backend/src/config/aws.js` & `backend/src/services/upload.service.js` (AWS SDK S3 client setup)
- `docs/design/aws-architecture.md` & `docs/design/deployment-diagram.md` (Cloud architecture documentation)

### What You Should NOT Modify
- `frontend/src/` (Owned by Member 1 — UI components & routing)
- `backend/src/controllers/` & `routes/` (Owned by Member 2 — REST API business logic)
- `database/schema.sql` (Owned by Member 3 — MySQL table definitions)
- `backend/tests/` & `docs/testing/` (Owned by Member 5 — automated test suites)

---

## 3. Team Dependencies

| Dependent On | Feature / Component | Interface Document |
|---|---|---|
| **Member 1 (Frontend)** | React static build bundle (`frontend/dist/`) for Nginx static serving | [SETUP.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-4/SETUP.md) |
| **Member 2 (Backend)** | Express API entry point (`backend/src/server.js`) on port 5000 | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-4/INTERFACES.md) |
| **Member 3 (Database)** | MySQL schema deployment to RDS private subnet | [INTERFACES.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-4/INTERFACES.md) |
| **Member 5 (QA)** | Automated CI pipeline execution (`ci.yml`) & AWS Infrastructure Validation | [CHECKLIST.md](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/member-workspaces/member-4/CHECKLIST.md) |

---

## 4. Expected Deliverables

1. AWS EC2, RDS MySQL, S3 bucket, and Security Group provisioning scripts and configs.
2. Production Nginx configuration (`nginx.conf`) and PM2 startup configuration.
3. Functional GitHub Actions CI/CD workflow (`ci.yml`) executing Jest tests and Vite frontend build.
4. AWS CloudWatch log shipping and alarm configuration (`cloudwatch-config.json`).
5. Completed task checklist in `CHECKLIST.md`.
6. Recorded actual work entries in `CONTRIBUTION.md`.

---

## 5. Handoff Workflow

```
Coordinator sends member-4 folder
       ↓
Read README.md & SETUP.md
       ↓
Execute tasks listed in TASKS.md
       ↓
Run local deployment & CI validation tests
       ↓
Log completed work in CONTRIBUTION.md
       ↓
Store AWS architecture evidence in evidence/
       ↓
Commit changes & push branch: feature/aws-devops
       ↓
Submit Pull Request for Team Review
```

---

## 6. Location of Work in Main Repository

All canonical source files for Member 4 reside in:
- `aws/`
- `.github/workflows/ci.yml`
- `backend/src/config/aws.js`
- `docs/design/aws-architecture.md`
