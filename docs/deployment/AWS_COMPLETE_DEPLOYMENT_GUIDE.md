# CloudStay — Master 30-Step AWS Deployment & Production Manual

> **System Version:** 1.0.0  
> **Authoritative Guide:** Comprehensive step-by-step production deployment manual for migrating the **CloudStay Student Hostel Booking System** from local Docker environment to Amazon Web Services (AWS).

---

## 1. Overview

CloudStay is a multi-tier student hostel booking system. This guide provides step-by-step instructions for deploying CloudStay to AWS using **Amazon EC2**, **Amazon RDS MySQL 8.0**, **Amazon S3**, **AWS IAM**, and **Docker Compose**.

Every command included in this manual specifies:
- What the command does
- Where it must be executed (Host Machine, EC2 Shell, or Docker Container)
- Expected output upon successful execution

---

## 2. Current CloudStay Architecture

In local development, CloudStay runs as three containerized services managed by Docker Compose:

```
[Browser on Host] ──► Frontend (Port 5173 / Nginx Port 80)
                 ──► Backend API (Port 5000 / Node Express)
                         │
                         └──► Database (Port 3306 / MySQL 8.0 Container)
```

---

## 3. AWS Production Architecture

In AWS production, database management is offloaded to Amazon RDS, and file storage is offloaded to Amazon S3:

```
[User Browser]
      │ HTTP (80) / HTTPS (443)
      ▼
[Amazon EC2 Instance] (Public Subnet)
  ├── Nginx Reverse Proxy (Port 80)
  ├── Frontend Container (React Static Bundle)
  └── Backend API Container (Express REST API on 127.0.0.1:5000)
            │
            ├── MySQL Protocol (Port 3306) ──► [Amazon RDS MySQL 8.0] (Private Subnet)
            │
            └── PutObject (SDK v3) ─────────► [Amazon S3 Bucket] (Receipt Storage)
```

---

## 4. AWS Account Prerequisites

1. An active AWS Account with administrator access.
2. AWS CLI v2 installed locally (`aws --version`).
3. Target Region selected: `ap-southeast-1` (Singapore) or your preferred region.

---

## 5. IAM Setup

Create an Administrative IAM User for deployment tasks instead of using the AWS Root Account.

---

## 6. VPC & Networking

Use the default AWS VPC or create a custom VPC with:
- Public Subnet (for EC2 Instance)
- Private Subnets (for RDS MySQL Database)

---

## 7. RDS MySQL Setup

1. Open RDS Console -> **Create Database**.
2. Engine: **MySQL 8.0**.
3. Template: **Free Tier** or **Production**.
4. DB Instance Identifier: `cloudstay-db`.
5. Master Username: `root`.
6. Master Password: `<YOUR_SECURE_RDS_PASSWORD>`.
7. Database Name: `cloudstay`.
8. Public Accessibility: **No**.
9. Security Group: Create `cloudstay-rds-sg`.

---

## 8. S3 Bucket Setup

Execute on Local Machine (AWS CLI):

```bash
# Create bucket
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

# Block Public Access
aws s3api put-public-access-block \
  --bucket cloudstay-receipts-prod-2024 \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```
*Expected Output*: `{}` (JSON response indicating successful policy application).

---

## 9. IAM Role & Policy Configuration

Create IAM Policy `CloudStayS3Policy`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
            "Resource": "arn:aws:s3:::cloudstay-receipts-prod-2024/*"
        }
    ]
}
```

Create IAM Role `cloudstay-ec2-role` with trust relationship for `ec2.amazonaws.com` and attach `CloudStayS3Policy`.

---

## 10. ECR Setup (Optional)

Container images can be built directly on EC2 via Docker Compose or pushed to Amazon Elastic Container Registry (ECR).

---

## 11. EC2 Provisioning

1. Go to EC2 Console -> **Launch Instance**.
2. Name: `cloudstay-server`.
3. AMI: **Ubuntu Server 22.04 LTS**.
4. Instance Type: `t3.small` (2 vCPU, 2GB RAM).
5. Key Pair: `cloudstay-key.pem`.
6. Security Group: Attach `cloudstay-ec2-sg`.
7. Advanced Details -> IAM Instance Profile -> `cloudstay-ec2-role`.

---

## 12. Docker Installation on EC2

Execute inside EC2 Shell:

```bash
# Connect to EC2
ssh -i cloudstay-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update packages & install Docker
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
newgrp docker

# Verify Docker installation
docker --version && docker compose version
```
*Expected Output*: `Docker version 27.x.x`, `Docker Compose version v2.x.x`.

---

## 13. GitHub Repository Deployment

Execute inside EC2 Shell:

```bash
cd /home/ubuntu
git clone https://github.com/IBUzenn/cloudstay.git
cd cloudstay
```
*Expected Output*: `Cloning into 'cloudstay'... done.`

---

## 14. Environment Configuration

Execute inside EC2 Shell:

```bash
cp .env.example .env
nano .env
```

Configure production environment variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=<RDS_ENDPOINT_HOSTNAME>
DB_PORT=3306
DB_NAME=cloudstay
DB_USER=root
DB_PASSWORD=<SECURE_RDS_PASSWORD>
JWT_SECRET=<RANDOM_256BIT_SECRET>
JWT_REFRESH_SECRET=<RANDOM_256BIT_REFRESH_SECRET>
CORS_ORIGIN=http://<EC2_PUBLIC_IP>:5173
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=cloudstay-receipts-prod-2024
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
VITE_API_BASE_URL=http://<EC2_PUBLIC_IP>:5000/api
```

---

## 15. Database Initialization

Execute inside EC2 Shell:

```bash
# Install mysql client
sudo apt-get install -y mysql-client

# Import Schema
mysql -h <RDS_ENDPOINT> -u root -p cloudstay < database/schema.sql

# Import Procedures
mysql -h <RDS_ENDPOINT> -u root -p cloudstay < database/procedures.sql

# Import Seeds
mysql -h <RDS_ENDPOINT> -u root -p cloudstay < database/seeds.sql
```

---

## 16. Backend Deployment

Configured via `docker-compose.yml` to run `backend/Dockerfile`.

---

## 17. Frontend Deployment

Configured via `docker-compose.yml` to run multi-stage build in `frontend/Dockerfile`.

---

## 18. Reverse Proxy Configuration

Nginx inside `frontend/nginx.conf` and `aws/nginx.conf` proxies `/api/` traffic to Express backend on port 5000.

---

## 19. HTTPS Configuration

Execute on EC2 Instance (Certbot for Nginx):

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 20. S3 Configuration Verification

Verify that S3 receipt uploads function using `backend/src/services/upload.service.js`.

---

## 21. Security Configuration

- Security Group `cloudstay-rds-sg` restricts port 3306 to `cloudstay-ec2-sg`.
- EC2 SSH restricted to admin IP (`/32`).
- JWT tokens signed with 256-bit secrets.

---

## 22. Logging and Monitoring

AWS CloudWatch agent installed on EC2 via `aws/cloudwatch-config.json`.

---

## 23. Health Checks

Test health endpoint from EC2 Shell:

```bash
curl http://localhost:5000/api/health
```
*Expected Output*: `{"success":true,"status":"ok","timestamp":"..."}`.

---

## 24. Testing

Execute Jest test suite inside container or locally:

```bash
cd backend && npm test
```
*Expected Output*: `33 passed, 33 total`.

---

## 25. Troubleshooting

Refer to [`docs/deployment/AWS_TROUBLESHOOTING.md`](AWS_TROUBLESHOOTING.md) for diagnostics.

---

## 26. Updating / Redeploying

Execute inside EC2 Shell:

```bash
git pull origin main
docker compose up --build -d
```

---

## 27. Backup Strategy

Amazon RDS automated backups enabled (7-day retention).

---

## 28. Shutdown / Cleanup

Execute inside EC2 Shell & AWS Console:

```bash
# Stop containers
docker compose down

# Terminate EC2 instance & delete RDS database in AWS Console
```

---

## 29. Cost Considerations

- EC2 `t3.small`: ~$15/month
- RDS `db.t3.micro`: ~$14/month (Free Tier eligible)
- S3 Storage: ~$0.023/GB/month

---

## 30. Final Production Checklist

- [x] RDS database initialized with schema, procedures, views, and seeds
- [x] IAM role `cloudstay-ec2-role` attached to EC2
- [x] S3 bucket `cloudstay-receipts-prod-2024` created with AES256 encryption
- [x] Docker Compose containers running healthy (`docker compose ps`)
- [x] End-to-end API and authentication verified
