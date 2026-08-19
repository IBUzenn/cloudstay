# CloudStay — AWS Architecture Diagram

## High-Level AWS Architecture

```mermaid
graph TB
    subgraph Internet
        USER[("👤 Students / Admins\n(Browser)")]
    end

    subgraph AWS_CLOUD["AWS Cloud — ap-southeast-1 (Singapore)"]

        subgraph VPC["VPC — 10.0.0.0/16"]

            subgraph PUBLIC_SUBNET["Public Subnet — 10.0.1.0/24"]
                EC2["🖥️ EC2 t3.micro\nUbuntu 22.04 LTS\n─────────────\nNginx (reverse proxy)\nPM2 (process manager)\nNode.js 18 Backend\nReact build (static)"]
                EIP["🌐 Elastic IP\n(Public)"]
            end

            subgraph PRIVATE_SUBNET["Private Subnet — 10.0.2.0/24"]
                RDS["🗄️ RDS db.t3.micro\nMySQL 8.0\n─────────────\nSingle-AZ\nAutomated backups\n7-day retention"]
            end

        end

        subgraph SECURITY_GROUPS["Security Groups"]
            SG_EC2["SG-EC2\n────────────\nInbound:\n• 80 (HTTP) 0.0.0.0/0\n• 443 (HTTPS) 0.0.0.0/0\n• 22 (SSH) Admin IP only\nOutbound: All"]
            SG_RDS["SG-RDS\n────────────\nInbound:\n• 3306 from SG-EC2 only\nOutbound: None"]
        end

        subgraph MANAGED_SERVICES["AWS Managed Services"]
            S3["☁️ AWS S3\nBucket: cloudstay-receipts\n─────────────\n• Private ACL\n• Versioning enabled\n• Server-side encryption\n• CORS configured"]
            CW["📊 CloudWatch\n─────────────\n• Log Group: /cloudstay/app\n• Metric: 5xx error rate\n• Alarm: >5 errors/5min\n• Dashboard: CloudStayOps"]
        end

        subgraph IAM["IAM"]
            ROLE["EC2 Instance Role\n─────────────\nPolicies attached:\n• cloudstay-s3-policy\n• cloudstay-cw-policy\n(No access keys stored\non instance)"]
            USERS_IAM["IAM Users (5 team members)\n─────────────\nDev user group:\n• EC2 read\n• RDS read\n• S3 read\nAdmin group:\n• Full provisioning"]
        end

    end

    subgraph GITHUB["GitHub"]
        GHA["⚙️ GitHub Actions\nCI/CD Pipeline\n─────────────\n• Lint & test on PR\n• Deploy on push to main\n• SSH deploy to EC2"]
    end

    %% Traffic flow
    USER -->|HTTPS 443| EIP
    EIP --> EC2
    EC2 -->|"Port 3306\n(private subnet)"| RDS
    EC2 -->|"HTTPS\n(IAM role auth)"| S3
    EC2 -->|"HTTPS\n(IAM role auth)"| CW
    ROLE -.->|"attached to"| EC2
    SG_EC2 -.->|"applied to"| EC2
    SG_RDS -.->|"applied to"| RDS
    GHA -->|"SSH deploy\nport 22"| EC2
```

---

## AWS Services Summary

| Service | Tier / Size | Purpose | Cost Estimate |
|---|---|---|---|
| **EC2** | t3.micro | Application server (backend + frontend static) | Free Tier / ~$8.50/mo |
| **RDS MySQL** | db.t3.micro, Single-AZ | Managed relational database | Free Tier / ~$15/mo |
| **S3** | Standard storage | Payment receipt file storage | < $0.12/mo |
| **CloudWatch** | Basic metrics + logs | Log aggregation, alarms | Free Tier |
| **IAM** | Roles + Users | Access management | Free |
| **VPC** | Default VPC | Network isolation | Free |
| **Elastic IP** | 1 address | Static public IP for EC2 | Free while attached |

---

## Network Flow

```
Browser → DNS → Elastic IP → EC2 Security Group (port 443)
                                    │
                              Nginx (SSL termination)
                              ├── /api/* → Node.js :5000
                              └── /*     → React static build
                                    │
                             Node.js backend
                             ├── MySQL queries → RDS (port 3306, private subnet)
                             ├── File uploads  → S3 (HTTPS, IAM role)
                             └── App logs      → CloudWatch (HTTPS, IAM role)
```

---

## IAM Least-Privilege Policy Summary

### EC2 Instance Role Policies

**cloudstay-s3-policy** — S3 access for receipt uploads:
```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
  "Resource": "arn:aws:s3:::cloudstay-receipts/*"
}
```

**cloudstay-cw-policy** — CloudWatch Logs agent:
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
