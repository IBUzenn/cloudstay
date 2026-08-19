# CloudStay — AWS Deployment Validation Checklist

This checklist verifies the CloudStay production deployment on AWS.

## 1. AWS IAM Validation
- [ ] IAM Role `CloudStayEC2Role` attached to EC2 instance.
- [ ] Policy contains least-privilege permissions for S3 (`s3:PutObject`, `s3:GetObject`) and CloudWatch logging (`logs:PutLogEvents`).
- [ ] Credentials/keys are NOT hardcoded in source files or committed to Git (`.env` added to `.gitignore`).

## 2. Amazon EC2 Validation
- [ ] Ubuntu 22.04 / Amazon Linux EC2 instance running (`t3.micro` / `t3.small`).
- [ ] Node.js 18+ runtime verified (`node -v`).
- [ ] PM2 process manager running Express API in cluster mode (`pm2 status`).
- [ ] Nginx proxying requests from Port 80/443 to internal Node.js backend port (5000).

## 3. Security Groups Validation
- [ ] EC2 Security Group allows Inbound: SSH (22), HTTP (80), HTTPS (443).
- [ ] RDS Security Group allows Inbound: MySQL (3306) restricted strictly to EC2 Security Group ID.
- [ ] Public database access disabled on RDS instance.

## 4. Amazon RDS (MySQL 8.0) Validation
- [ ] Backend successfully establishes connection pool to RDS endpoint.
- [ ] Database schema migrations applied (`001_initial.sql`).
- [ ] Data CRUD operations succeed (users registered, bookings inserted, rooms status toggled).

## 5. Amazon S3 Validation
- [ ] Production bucket `cloudstay-receipts-bucket` created.
- [ ] Student payment receipt uploaded via `/api/bookings/:id/receipt`.
- [ ] File successfully saved in S3 under `receipts/{bookingId}/{uuid}.{ext}`.
- [ ] Public presigned / object URL opens uploaded receipt correctly in browser.
- [ ] No receipt file stored permanently on local EC2 disk storage.

## 6. AWS CloudWatch Validation
- [ ] CloudWatch Agent active on EC2 (`systemctl status amazon-cloudwatch-agent`).
- [ ] Log group `/cloudstay/backend/app.log` collecting application logs.
- [ ] System metrics (CPU Utilization, Memory, Disk Space) visible in CloudWatch Dashboard.
