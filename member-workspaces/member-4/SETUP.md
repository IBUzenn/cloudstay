# Member 4 — Setup Instructions

## 1. Required Software

- **AWS CLI**: `v2.x`
- **SSH Client**: OpenSSH (`ssh`)
- **Node.js**: `v18.x`
- **Git**: `v2.x`

---

## 2. Directory Scope

Your work is scoped exclusively to:
```
CloudStay/aws/
CloudStay/.github/workflows/ci.yml
CloudStay/backend/src/config/aws.js
CloudStay/docs/design/aws-architecture.md
```

---

## 3. Environment Variables (EC2 Production Placeholders)

Create `.env` on EC2 instance:

```env
# EC2 Server Environment (Placeholders)
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://your-ec2-elastic-ip

# AWS Managed Services Config
AWS_REGION=ap-southeast-1
S3_BUCKET=cloudstay-receipts

# RDS Connection (Private Subnet)
DB_HOST=cloudstay-db.xxxxxx.ap-southeast-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=cloudstay_admin
DB_PASSWORD=prod_db_password_placeholder
DB_NAME=cloudstay

# JWT Cryptographic Secrets
JWT_SECRET=prod_jwt_secret_key_placeholder
JWT_REFRESH_SECRET=prod_jwt_refresh_secret_key_placeholder
```

> **Security Note:** NEVER commit production `.env` files or SSH private keys into Git.

---

## 4. EC2 Provisioning Commands

Run on Ubuntu 22.04 LTS EC2 server:

```bash
# Execute setup script
chmod +x aws/setup-ec2.sh
./aws/setup-ec2.sh

# Execute deployment script
chmod +x aws/deploy.sh
./aws/deploy.sh
```

---

## 5. Verification Steps

1. Verify Nginx status:
   ```bash
   sudo systemctl status nginx
   ```
2. Verify PM2 process status:
   ```bash
   pm2 status
   ```
3. Test local proxy to Node.js backend:
   ```bash
   curl http://localhost:5000/api/health
   ```
4. Verify CloudWatch logs agent:
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status
   ```
