# Member 4 — Interface Contracts (DevOps & Infrastructure)

This document defines the infrastructure interface contracts for AWS Services (`EC2`, `RDS`, `S3`, `CloudWatch`), `Nginx`, `PM2`, and `GitHub Actions`.

---

## 1. Nginx Reverse Proxy Specifications (`aws/nginx/nginx.conf`)

### 1.1 Inbound Traffic Routing
- **Public Port:** 80 (HTTP) / 443 (HTTPS)
- **API Proxy Rule:**
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:5000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  ```
- **Static SPA Rule:**
  ```nginx
  location / {
      root /var/www/cloudstay/dist;
      try_files $uri $uri/ /index.html;
  }
  ```

---

## 2. AWS Security Group Rules (`aws/security-groups/`)

### 2.1 EC2 Security Group (`SG-EC2`)
- **Inbound Rules:**
  - Port 80 (HTTP) ← `0.0.0.0/0`
  - Port 443 (HTTPS) ← `0.0.0.0/0`
  - Port 22 (SSH) ← Admin IP Only (`/32`)
- **Outbound Rules:** All traffic (`0.0.0.0/0`)

### 2.2 RDS Security Group (`SG-RDS`)
- **Inbound Rules:**
  - Port 3306 (MySQL) ← Strictly from `SG-EC2`
- **Outbound Rules:** None

---

## 3. IAM Policy Contracts (`aws/iam/`)

### 3.1 S3 Access Policy (`cloudstay-s3-policy`)
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject",
    "s3:DeleteObject"
  ],
  "Resource": "arn:aws:s3:::cloudstay-receipts/*"
}
```

### 3.2 CloudWatch Logs Policy (`cloudstay-cw-policy`)
```json
{
  "Effect": "Allow",
  "Action": [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "logs:DescribeLogStreams"
  ],
  "Resource": "arn:aws:logs:*:*:log-group:/cloudstay/*"
}
```

---

## 4. GitHub Actions CI/CD Contract (`.github/workflows/ci.yml`)

### 4.1 Trigger Matrix
- Triggers on `push` and `pull_request` to branches `main` and `develop`.

### 4.2 Job Specifications
1. **`test-backend`**:
   - Environment: `ubuntu-latest`, Node.js `18`
   - Command: `cd CloudStay/backend && npm ci && npm run test:coverage`
2. **`build-frontend`**:
   - Environment: `ubuntu-latest`, Node.js `18`
   - Command: `cd CloudStay/frontend && npm ci && npm run build`
