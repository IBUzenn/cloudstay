# CloudStay — Deployment Diagram

## Production Deployment Architecture

```mermaid
graph TB
    subgraph CLIENT["Client Layer"]
        BROWSER["🌐 Web Browser\nChrome / Firefox / Safari\nDesktop | Tablet | Mobile"]
    end

    subgraph AWS["AWS Cloud — Production"]

        subgraph EC2_NODE["EC2 t3.micro — Ubuntu 22.04"]
            NGINX["Nginx 1.24\n:80 → redirect :443\n:443 → SSL termination\n/api/* → proxy :5000\n/* → serve /var/www/cloudstay"]

            subgraph PM2["PM2 Process Manager"]
                NODE["Node.js 18\nExpress API\n:5000\n(cluster mode, 2 workers)"]
            end

            STATIC["React Build\n/var/www/cloudstay/\n(npm run build output)"]

            CW_AGENT["CloudWatch Agent\n/var/log/cloudstay/*.log\n→ /cloudstay/app log group"]
        end

        subgraph RDS_NODE["RDS — Private Subnet"]
            MYSQL["MySQL 8.0\ndb.t3.micro\nPort 3306\nMulti-AZ: disabled\nBackup: 7 days"]
        end

        subgraph S3_NODE["S3 Bucket"]
            S3B["cloudstay-receipts\nServer-side encryption: AES-256\nVersioning: enabled\nLifecycle: archive > 365d"]
        end

        subgraph CW_NODE["CloudWatch"]
            CWL["Log Group:\n/cloudstay/app"]
            CWM["Metric Filter:\n5xx error count"]
            CWA["Alarm:\nerrorCount > 5\nper 5 minutes"]
        end

    end

    subgraph GITHUB["GitHub"]
        REPO["cloudstay repository\nmain branch"]
        GH_ACTIONS["GitHub Actions\nci-cd.yml"]
    end

    %% Client to EC2
    BROWSER -->|"HTTPS :443"| NGINX
    NGINX -->|"proxy_pass"| NODE
    NGINX -->|"serve static"| STATIC

    %% EC2 internal
    NODE -->|"mysql2 pool\nport 3306"| MYSQL
    NODE -->|"AWS SDK\nputObject"| S3B
    CW_AGENT -->|"PutLogEvents"| CWL

    %% CloudWatch chain
    CWL --> CWM --> CWA

    %% CI/CD
    REPO --> GH_ACTIONS
    GH_ACTIONS -->|"SSH rsync\nport 22"| EC2_NODE
```

---

## Deployment Stack Per Layer

### EC2 Software Stack

```
Ubuntu 22.04 LTS
│
├── System
│   ├── OpenSSL 3.x        (SSL/TLS)
│   ├── Nginx 1.24         (Reverse proxy)
│   └── CloudWatch Agent   (Log shipping)
│
├── Runtime
│   ├── Node.js 18.x       (LTS)
│   ├── npm 9.x
│   └── PM2 5.x            (Process manager)
│
├── Application
│   ├── backend/           (Express API — port 5000)
│   └── /var/www/cloudstay (React static build)
│
└── Configuration
    ├── /etc/nginx/sites-enabled/cloudstay.conf
    ├── /home/ubuntu/cloudstay/backend/.env
    ├── /opt/aws/amazon-cloudwatch-agent/etc/config.json
    └── pm2 ecosystem.config.js
```

### Environment Variables (Production)

```bash
# backend/.env (on EC2 — never in repo)
NODE_ENV=production
PORT=5000
DB_HOST=<rds-endpoint>.rds.amazonaws.com
DB_PORT=3306
DB_NAME=cloudstay
DB_USER=cloudstay_app
DB_PASSWORD=<secure-password>
JWT_SECRET=<256-bit-random>
JWT_REFRESH_SECRET=<256-bit-random>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=cloudstay-receipts
CORS_ORIGIN=https://<your-domain-or-ec2-ip>
LOG_LEVEL=info
```

---

## CI/CD Pipeline Flow

```mermaid
flowchart LR
    A[Push to main] --> B[GitHub Actions trigger]
    B --> C[Install deps\nnpm ci]
    C --> D[Run ESLint]
    D --> E[Run Jest tests]
    E --> F{All checks\npass?}
    F -- No --> G[Fail pipeline\nnotify team]
    F -- Yes --> H[SSH into EC2]
    H --> I[git pull origin main]
    I --> J[cd backend\nnpm ci --production]
    J --> K[pm2 reload cloudstay-api]
    K --> L[Build frontend\nnpm run build]
    L --> M[rsync dist/\nto /var/www/cloudstay]
    M --> N[Smoke test:\ncurl https://host/api/health]
    N --> O{200 OK?}
    O -- Yes --> P[Deploy successful]
    O -- No --> Q[pm2 revert\nrollback]
```
