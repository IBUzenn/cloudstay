# CloudStay — AWS Troubleshooting Matrix

This guide provides diagnostic procedures and resolution steps for common deployment issues encountered when running CloudStay on Amazon Web Services (AWS).

---

## 1. Network & Infrastructure Issues

### Issue 1.1: Cannot SSH into EC2 Instance
* **Symptom**: `ssh: connect to host <EC2_PUBLIC_IP> port 22: Connection timed out` or `Permission denied (publickey)`.
* **Likely Cause**:
  1. Security group does not allow port 22 from your current IP.
  2. Wrong SSH private key (`.pem`) used or incorrect SSH user (`ec2-user` vs `ubuntu`).
  3. Strict file permissions on private key file.
* **Diagnosis Command**:
  ```bash
  # Check key permissions
  ls -l ~/.ssh/cloudstay-key.pem

  # Verbose SSH test
  ssh -v -i ~/.ssh/cloudstay-key.pem ubuntu@<EC2_PUBLIC_IP>
  ```
* **Fix**:
  1. Ensure permissions are set to `400`: `chmod 400 ~/.ssh/cloudstay-key.pem`.
  2. In AWS Console -> EC2 -> Security Groups -> `cloudstay-ec2-sg`, add/update inbound rule: `Type: SSH`, `Port: 22`, `Source: My IP`.
  3. Verify correct default user: `ubuntu` for Ubuntu Server AMI, `ec2-user` for Amazon Linux 2023.

---

### Issue 1.2: Backend Cannot Connect to Amazon RDS (Database Timeout)
* **Symptom**: Backend logs report `ETIMEDOUT`, `ECONNREFUSED`, or `Failed to start server: connect ETIMEDOUT <RDS_ENDPOINT>:3306`.
* **Likely Cause**:
  1. Security group for RDS (`cloudstay-rds-sg`) does not permit inbound port 3306 from EC2.
  2. Incorrect `DB_HOST` or `DB_PASSWORD` in `.env`.
* **Diagnosis Command**:
  ```bash
  # Run from inside EC2 instance
  nc -zv -w 5 <RDS_ENDPOINT> 3306
  # OR test with mysql client
  mysql -h <RDS_ENDPOINT> -u root -p
  ```
* **Fix**:
  1. Go to AWS Console -> RDS -> Instances -> `cloudstay-db` -> Connectivity & Security -> Security Groups -> Select `cloudstay-rds-sg`.
  2. Edit Inbound Rules -> Add Rule:
     - `Type: MYSQL/Aurora (3306)`
     - `Source: Custom -> Select cloudstay-ec2-sg` (Security group ID).
  3. Verify `DB_HOST` in `.env` contains the exact RDS endpoint hostname (without `https://` or port number).

---

## 2. Docker & Container Startup Issues

### Issue 2.1: Container Exits Immediately / Restart Loop
* **Symptom**: `docker compose ps` shows `cloudstay-backend` or `cloudstay-frontend` as `Exited (1)` or constantly restarting.
* **Likely Cause**:
  1. Missing required environment variables (`JWT_SECRET`, `DB_HOST`).
  2. Node.js startup failure or invalid SQL stored procedure syntax.
* **Diagnosis Command**:
  ```bash
  docker compose logs --tail=100 backend
  docker compose logs --tail=100 frontend
  ```
* **Fix**:
  1. Inspect the log output for explicit runtime errors.
  2. Ensure `database/procedures.sql` contains labelled `BEGIN` blocks (`sp_create_booking: BEGIN`) for `LEAVE` statements.
  3. Confirm `.env` exists in the repository root and contains all non-empty variables defined in `.env.example`.

---

### Issue 2.2: Docker Daemon / API Version Mismatch Error
* **Symptom**: `failed to connect to the docker API` or `request returned 500 Internal Server Error`.
* **Likely Cause**: Docker service stopped, socket permissions error, or context switched.
* **Diagnosis Command**:
  ```bash
  sudo systemctl status docker
  docker context ls
  ```
* **Fix**:
  1. Restart Docker daemon: `sudo systemctl restart docker`.
  2. Ensure user is in `docker` group: `sudo usermod -aG docker $USER && newgrp docker`.

---

## 3. Storage & AWS S3 Issues

### Issue 3.1: Receipt Upload Returns 502 / S3 AccessDenied
* **Symptom**: Uploading receipt fails with `S3 upload failed: Access Denied` or HTTP `502 Bad Gateway`.
* **Likely Cause**:
  1. IAM role not attached to the EC2 instance.
  2. IAM policy attached to role lacks `s3:PutObject` permission on target bucket.
  3. S3 bucket name in `AWS_S3_BUCKET` does not match the actual created bucket name.
* **Diagnosis Command**:
  ```bash
  # Verify IAM role credentials from inside EC2
  curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/
  ```
* **Fix**:
  1. AWS Console -> EC2 -> Select `cloudstay-server` -> Actions -> Security -> Modify IAM Role -> Attach `cloudstay-ec2-role`.
  2. Ensure IAM policy attached to `cloudstay-ec2-role` allows `s3:PutObject` and `s3:GetObject` on `arn:aws:s3:::<AWS_S3_BUCKET>/*`.

---

## 4. Frontend & Nginx Proxy Issues

### Issue 4.1: CORS Error in Browser Console
* **Symptom**: `Access to XMLHttpRequest at 'http://<EC2_IP>:5000/api/...' from origin 'http://<EC2_IP>:5173' has been blocked by CORS policy`.
* **Likely Cause**: `CORS_ORIGIN` in backend `.env` does not match the browser's exact origin protocol/domain/port.
* **Diagnosis Command**:
  ```bash
  # Check header returned by backend
  curl -I -X OPTIONS http://localhost:5000/api/hostels \
    -H "Origin: http://<EC2_PUBLIC_IP>:5173" \
    -H "Access-Control-Request-Method: GET"
  ```
* **Fix**:
  1. Update `.env`: `CORS_ORIGIN=http://<EC2_PUBLIC_IP>:5173` (or `http://yourdomain.com`).
  2. Restart backend: `docker compose restart backend`.

---

### Issue 4.2: Direct Page Refresh Returns 404 (React Router SPA Issue)
* **Symptom**: Navigating to `http://<EC2_IP>:5173/login` or `http://<EC2_IP>:5173/student/dashboard` directly returns Nginx `404 Not Found`.
* **Likely Cause**: Nginx configuration missing fallback to `/index.html`.
* **Diagnosis Command**: Check `frontend/nginx.conf` or `/etc/nginx/sites-available/cloudstay`.
* **Fix**:
  Ensure the Nginx configuration includes:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

---

## 5. Database Initialization & Seed Issues

### Issue 5.1: Seed Users Cannot Log In (`Invalid email or password`)
* **Symptom**: Logging in as `admin@cloudstay.edu` or `abena.mensah@student.edu` returns HTTP 401.
* **Likely Cause**: Password hashes in database do not match bcrypt cost factor or salt format.
* **Diagnosis Command**:
  ```bash
  # Test bcrypt hash directly against Node.js backend
  docker exec -it cloudstay-backend node -e "
    const b = require('bcryptjs');
    console.log(b.compareSync('Admin@1234', '\$2a\$12\$1PheI9cxqYQidomLVH2TIOsSTEymTjYD9fO/cy0ShBsGrOWOtCN0y'));
  "
  ```
* **Fix**:
  Execute the password reset script or re-import the updated `database/seeds.sql` containing valid bcrypt hashes:
  - Admin/Manager Password: `Admin@1234`
  - Student Password: `Student@1234`
