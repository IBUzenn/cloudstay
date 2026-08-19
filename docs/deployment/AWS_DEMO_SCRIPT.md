# CloudStay — AWS Presentation & Video Demo Script

> **Purpose**: A step-by-step presentation script structured for recording a live video presentation or class demonstration of the CloudStay AWS deployment.

---

## Presentation Walkthrough Matrix (20 Steps)

| Step | Section | What to Show (Screen) | What to Say (Script) | Technical Concept Demonstrated |
|---|---|---|---|---|
| **1** | Introduction | GitHub Repository root (`CloudStay`) | *"Welcome! Today I will demonstrate the full deployment of CloudStay, a hostel booking web app, on AWS using EC2, RDS, S3, and Docker."* | Infrastructure as Code & Repository Organization |
| **2** | System Map | `AWS_ARCHITECTURE.md` Mermaid diagram | *"Our system architecture separates public web traffic handled by Nginx from private database services running in managed AWS RDS."* | Multi-tier Web Architecture & Network Isolation |
| **3** | AWS Console | AWS Management Console Home | *"Here is our AWS Management Console centered in the ap-southeast-1 region."* | AWS Region & Cloud Control Plane |
| **4** | EC2 Instance | EC2 Dashboard -> Instances (`cloudstay-server`) | *"We have a t3.small EC2 instance running Ubuntu. It hosts our Docker containers and Nginx reverse proxy."* | Compute Provisioning & Cloud Hosting |
| **5** | RDS MySQL | RDS Dashboard -> Databases (`cloudstay-db`) | *"Our database is hosted on Amazon RDS MySQL 8.0, isolated inside our VPC with security group access."* | Managed Database Service & Relational Storage |
| **6** | S3 Bucket | S3 Dashboard -> Buckets (`cloudstay-receipts`) | *"Payment receipts uploaded by students are securely stored in our Amazon S3 bucket with server-side encryption."* | Object Storage & Encryption at Rest |
| **7** | IAM Role | IAM Console -> Roles (`cloudstay-ec2-role`) | *"Instead of hardcoding access keys, our EC2 instance uses an IAM Role with least-privilege policies for S3."* | Identity & Access Management (Least Privilege) |
| **8** | EC2 Terminal | SSH session: `ssh -i key.pem ubuntu@<EC2_IP>` | *"Let's SSH directly into our EC2 instance to verify the running environment."* | Secure Remote Shell Management |
| **9** | Docker Containers | Terminal: `docker compose ps` | *"We run two active containers: `cloudstay-frontend` serving static assets via Nginx, and `cloudstay-backend` running our Express REST API."* | Containerization & Multi-container Orchestration |
| **10** | Live Container Logs | Terminal: `docker compose logs --tail=20 backend` | *"Looking at the logs, we can see the backend connected to RDS MySQL and is listening on port 5000."* | Application Logging & Health Diagnostics |
| **11** | Open Frontend | Browser tab: `http://<EC2_PUBLIC_IP>:5173` | *"Opening our browser, the React frontend loads immediately from Nginx."* | Single Page Application (SPA) Delivery |
| **12** | Registration | Browser: Register new student account (`testuser@student.edu`) | *"Let's register a new student account. This sends an HTTP POST request to our Express API on EC2."* | RESTful API & Form Processing |
| **13** | Student Login | Browser: Login as `abena.mensah@student.edu` | *"Logging in as a student generates a signed JWT token stored securely in localStorage."* | Stateless Authentication & JWT Tokens |
| **14** | Hostel Browsing | Browser: Browse hostels list (Blue Block, Green Block) | *"The hostel listings are fetched dynamically from RDS MySQL via stored procedure `sp_get_available_rooms`."* | Database Views & Stored Procedures |
| **15** | Booking Creation | Browser: Select Room `BB-101` -> Submit Booking | *"When we create a booking, a row is created in RDS and room status is updated automatically."* | ACID Transactions & Foreign Keys |
| **16** | Receipt Upload | Browser: Upload receipt image (`receipt.jpg`) | *"Now we upload a payment receipt. The backend streams the buffer directly to Amazon S3."* | Buffer Streaming & Cloud Object Upload |
| **17** | S3 Verification | AWS Console: S3 Bucket contents | *"Checking our S3 bucket, we see the newly uploaded object under `receipts/{bookingId}/{uuid}.jpg`."* | Cloud Storage Object Persistence |
| **18** | Database Verification | Terminal: `mysql -h <RDS_ENDPOINT> -u root -p` | *"Querying RDS directly confirms 10 users, 4 hostels, 29 rooms, and our new booking stored in MySQL."* | Relational Data Verification |
| **19** | Admin Review | Browser: Login as `admin@cloudstay.edu` -> Approve Booking | *"Switching to Admin view, the manager reviews and approves the booking, executing procedure `sp_update_booking_status`."* | Role-Based Access Control (RBAC) |
| **20** | Conclusion | Browser + Console Summary | *"That completes our CloudStay demo! The application is fully deployed, containerized, and backed by production AWS services."* | Full-Stack Cloud Deployment Verification |
