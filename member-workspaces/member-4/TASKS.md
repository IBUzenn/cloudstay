# Member 4 — Task Specifications

## Task List Summary

- `M4-OPS-001`: AWS Infrastructure Architecture & VPC Security Groups
- `M4-OPS-002`: S3 Bucket Provisioning & SDK v3 Integration
- `M4-OPS-003`: Nginx Reverse Proxy & PM2 Process Management Setup
- `M4-OPS-004`: GitHub Actions CI/CD Pipeline (`ci.yml`)
- `M4-OPS-005`: CloudWatch Logging Agent & 5xx Error Alarms

---

### Task M4-OPS-001
- **Task ID:** M4-OPS-001
- **Task:** Architect AWS VPC, EC2 instance, RDS MySQL database, and Security Groups.
- **Purpose:** Provide secure cloud compute and database hosting in region `ap-southeast-1`.
- **Files involved:**
  - `aws/setup-ec2.sh`
  - `docs/design/aws-architecture.md`
- **Prerequisites:** AWS Management Console or AWS CLI access.
- **Implementation instructions:**
  - Provision VPC `10.0.0.0/16` with Public Subnet (`10.0.1.0/24`) and Private Subnet (`10.0.2.0/24`).
  - Configure `SG-EC2`: Allow inbound 80 (HTTP), 443 (HTTPS), and 22 (SSH from Admin IP); outbound All.
  - Configure `SG-RDS`: Allow inbound 3306 strictly from `SG-EC2`; outbound None.
  - Launch EC2 `t3.micro` (Ubuntu 22.04 LTS) in public subnet and RDS `db.t3.micro` (MySQL 8.0) in private subnet.
- **Expected result:** EC2 can connect to RDS on port 3306; direct public internet access to RDS port 3306 is blocked.
- **Testing requirement:** Test SSH connection to EC2 and test `mysql -h <rds_endpoint> -u root -p` from EC2 shell.
- **Completion criteria:** Security groups strictly enforce isolated network flow.
- **Dependency:** None.

---

### Task M4-OPS-002
- **Task ID:** M4-OPS-002
- **Task:** Configure AWS S3 bucket and backend SDK v3 integration.
- **Purpose:** Securely store payment receipt uploads with server-side encryption.
- **Files involved:**
  - `backend/src/config/aws.js`
  - `backend/src/services/upload.service.js`
- **Prerequisites:** S3 bucket `cloudstay-receipts` created in `ap-southeast-1`.
- **Implementation instructions:**
  - Configure S3 bucket with private ACL, versioning enabled, and server-side encryption (AES-256).
  - Attach EC2 IAM Instance Role with policy `cloudstay-s3-policy` granting `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`.
  - In `backend/src/config/aws.js`: Instantiate `@aws-sdk/client-s3` `S3Client` reading `AWS_REGION` from env.
- **Expected result:** Backend sends file buffers to S3 bucket without using static access keys.
- **Testing requirement:** Run `upload.api.test.js` using Jest mocks to verify S3 SDK command structure.
- **Completion criteria:** Zero AWS credentials stored in code or on disk; S3 access succeeds via IAM role.
- **Dependency:** `M4-OPS-001`.

---

### Task M4-OPS-003
- **Task ID:** M4-OPS-003
- **Task:** Configure Nginx reverse proxy and PM2 process management on EC2.
- **Purpose:** Serve static React bundle and proxy `/api/*` traffic to Node.js backend on port 5000.
- **Files involved:**
  - `aws/nginx/nginx.conf`
  - `aws/deploy.sh`
- **Prerequisites:** Nginx and PM2 installed on EC2 instance (`aws/setup-ec2.sh`).
- **Implementation instructions:**
  - In `nginx.conf`: Configure `location /api/ { proxy_pass http://localhost:5000; }` and `location / { root /var/www/cloudstay/dist; try_files $uri $uri/ /index.html; }`.
  - Configure PM2 to run Node.js backend (`src/server.js`) with `pm2 startup` for boot recovery.
  - Create deployment script `aws/deploy.sh` automating pull, build, and PM2 reload.
- **Expected result:** Navigating to EC2 Elastic IP loads React frontend; `/api/health` proxies to Express backend.
- **Testing requirement:** Test reloading PM2 (`pm2 reload all`) and sending HTTP requests to Nginx port 80.
- **Completion criteria:** Nginx routes requests correctly with zero downtime during deployment.
- **Dependency:** Member 1 static build & Member 2 backend server.

---

### Task M4-OPS-004
- **Task ID:** M4-OPS-004
- **Task:** Create GitHub Actions CI/CD Pipeline workflow.
- **Purpose:** Automate backend testing and frontend build validation on pull requests and pushes.
- **Files involved:**
  - `.github/workflows/ci.yml`
- **Prerequisites:** Repository administrative access.
- **Implementation instructions:**
  - Create `ci.yml` triggering on `push` and `pull_request` to `main` and `develop`.
  - Job `test-backend`: Checkout code → Setup Node.js 18 → `npm ci` in `CloudStay/backend` → `npm run test:coverage`.
  - Job `build-frontend`: Checkout code → Setup Node.js 18 → `npm ci` in `CloudStay/frontend` → `npm run build`.
- **Expected result:** Pushing a pull request triggers parallel execution of backend tests and frontend build.
- **Testing requirement:** Push test commit to feature branch; verify GitHub Actions tab shows green checkmark.
- **Completion criteria:** CI workflow completes cleanly with 0 step errors.
- **Dependency:** Member 1 `frontend/package.json` & Member 5 Jest test suite.

---

### Task M4-OPS-005
- **Task ID:** M4-OPS-005
- **Task:** Configure AWS CloudWatch log agent and 5xx error alarms.
- **Purpose:** Aggregated application logging and automated failure notification.
- **Files involved:**
  - `aws/cloudwatch-config.json`
- **Prerequisites:** CloudWatch Logs agent installed on EC2.
- **Implementation instructions:**
  - Create `cloudwatch-config.json` shipping `/var/log/nginx/access.log` and Winston logs to Log Group `/cloudstay/app`.
  - Attach IAM policy `cloudstay-cw-policy` to EC2 Instance Role (`logs:PutLogEvents`).
  - Create CloudWatch Metric Filter counting 5xx HTTP responses; trigger alarm if >5 errors occur in 5 minutes.
- **Expected result:** Winston application logs ship to CloudWatch Logs console in real-time.
- **Testing requirement:** Generate 5xx test error on health endpoint; inspect CloudWatch metrics dashboard.
- **Completion criteria:** Log group `/cloudstay/app` actively receives log events on EC2.
- **Dependency:** `M4-OPS-001`.
