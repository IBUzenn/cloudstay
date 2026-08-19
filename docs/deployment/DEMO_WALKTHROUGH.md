# CloudStay — Docker Demo Walkthrough

## 1. What is Docker?

Docker is a tool that **packages an application and everything it needs to run** (code, runtime, libraries, configuration) into a single portable unit called a **container**.

Think of it like this: instead of asking everyone on the team to install Node.js, MySQL, and configure their system the same way, Docker lets you say:
> "Here's a box with everything pre-installed. Run it anywhere."

---

## 2. Why CloudStay Uses Docker

CloudStay has three separate components:
- A **React frontend** (JavaScript, Vite build tools)
- A **Node.js backend** (Express API server)
- A **MySQL database** (with our specific schema and seed data)

Without Docker, you would have to:
- Install Node.js 18 manually
- Install MySQL 8.0 manually
- Run 3 SQL scripts in the right order
- Configure environment variables correctly
- Ensure everything starts in the right order

With Docker:
```
docker compose up --build
```
That's it. Everything starts, connects, and initializes automatically.

---

## 3. What is a Docker Image?

A **Docker image** is a blueprint for a container. It's like a snapshot of a configured system.

For example, the backend image contains:
- Ubuntu Linux (minimal)
- Node.js 18
- CloudStay's `node_modules` (production only)
- CloudStay's source code (`src/`)
- The startup command (`node src/server.js`)

Images are built from **Dockerfiles** — text files with step-by-step instructions.

---

## 4. What is a Container?

A **container** is a running instance of an image.

Images are like blueprints. Containers are like the buildings constructed from those blueprints.

You can run multiple containers from the same image. When you stop a container, its data is lost (unless you use volumes).

---

## 5. What Does Docker Compose Do?

Docker Compose orchestrates **multiple containers** as a single application.

Instead of starting each container manually with long `docker run` commands, you define everything in `docker-compose.yml` and use:

```bash
docker compose up --build    # build images and start all containers
docker compose down          # stop all containers
docker compose down -v       # stop all containers and delete volumes
docker compose logs -f       # stream logs from all containers
```

---

## 6. Why Are There Three Services?

CloudStay's `docker-compose.yml` defines three services:

| Service | Image | Purpose |
|---|---|---|
| `mysql` | `mysql:8.0` (official) | Database server |
| `backend` | Built from `backend/Dockerfile` | Express REST API |
| `frontend` | Built from `frontend/Dockerfile` | Nginx serving React app |

Each service runs in its own isolated container, but they communicate through a shared Docker network called `cloudstay-network`.

---

## 7. Why Does MySQL Use a Persistent Volume?

Containers are **ephemeral** — when you stop and remove a container, any data stored inside it is gone.

For a database, this would be catastrophic. Every restart would wipe all user accounts, bookings, and hostel data.

A **named volume** (`mysql_data`) solves this. Docker stores the volume's data on the host machine's disk. Even if the MySQL container is deleted, the volume persists.

```yaml
volumes:
  mysql_data:
    name: cloudstay_mysql_data
```

**To intentionally reset the database:**
```bash
docker compose down -v       # removes the volume
docker compose up --build    # reinitializes from SQL scripts
```

---

## 8. Why Does the Backend Use `DB_HOST=mysql`?

This is one of the most common Docker mistakes.

Inside a Docker container, `localhost` refers to the **container itself**, not the host machine and not other containers.

When the backend tries to connect to MySQL, it must use the **service name** defined in `docker-compose.yml`:

```yaml
# This is WRONG inside Docker:
DB_HOST=localhost   ❌

# This is CORRECT inside Docker:
DB_HOST=mysql       ✅
```

Docker's internal DNS automatically resolves the service name `mysql` to the MySQL container's IP address on the `cloudstay-network`.

---

## 9. Why Does the Frontend Use `localhost:5000`?

The frontend's `VITE_API_BASE_URL` is set to `http://localhost:5000/api`.

This is correct because:

1. **Vite bakes this URL into the JavaScript bundle at build time.**
2. **The JavaScript runs in the user's browser, not inside Docker.**
3. The user's browser cannot resolve Docker service names like `backend`.
4. `localhost:5000` works because Docker maps the backend container's port 5000 to the host machine's port 5000.

```
Browser (on host) → localhost:5000 → Docker port mapping → backend container:5000 ✅

Browser (on host) → backend:5000  → FAILS — browser can't resolve Docker names ❌
```

---

## 10. Why the Frontend Cannot Use `backend:5000`

To be absolutely clear:

- `backend:5000` is **only resolvable inside the Docker network**
- Containers inside Docker can reach each other using service names
- The user's browser is **outside Docker** — it lives on the host machine
- Docker service names are not in the host's DNS

This is a fundamental Docker networking concept. When in doubt:
- **Server-to-server** (e.g., backend→MySQL): use Docker service names
- **Browser-to-server** (e.g., frontend→backend): use `localhost` + host port mapping

---

## 11. How the Containers Communicate

```
User's Browser
│
│  HTTP request: GET http://localhost:5173
│
▼
Docker port mapping: host:5173 → frontend container:80
│
▼
Nginx (inside frontend container)
│  Serves React static files
│
─────────────────────────────────────────────────────────

User's Browser
│
│  HTTP request: POST http://localhost:5000/api/auth/login
│
▼
Docker port mapping: host:5000 → backend container:5000
│
▼
Express API (inside backend container)
│
│  MySQL connection: mysql:3306 (Docker internal DNS)
│
▼
MySQL container:3306
│
▼
mysql_data volume (persistent storage on host disk)
```

---

## 12. How Database Initialization Works

MySQL's official Docker image has a special feature:

When the database volume is **empty** (first run), MySQL automatically executes all SQL files in `/docker-entrypoint-initdb.d/`.

CloudStay mounts three SQL files there, prefixed with numbers to control execution order:

| Prefix | File | Purpose |
|---|---|---|
| `01-` | `schema.sql` | Creates database, all tables, triggers, views |
| `02-` | `procedures.sql` | Creates stored procedures |
| `03-` | `seeds.sql` | Inserts test users, hostels, rooms, bookings |

After this, CloudStay's database is fully initialized with:
- 10 users (1 admin, 2 managers, 7 students)
- 4 hostels
- 29 rooms
- 8 bookings in various states

---

## 13. How to Start the Application

```bash
# From the CloudStay root directory:
docker compose up --build
```

What happens:
1. Docker builds the backend image (Node.js + source code)
2. Docker builds the frontend image (Vite build → Nginx)
3. MySQL container starts and initializes the database
4. Backend container starts and connects to MySQL
5. Frontend container starts (Nginx serving built React app)

After 30-60 seconds, visit:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## 14. How to Stop the Application

```bash
# Stop all containers (preserves database data)
docker compose down

# Stop and view logs first
docker compose logs
docker compose down
```

---

## 15. How to Reset the Database

The database volume persists between restarts. To completely reset it:

```bash
# Stop all containers AND delete the mysql_data volume
docker compose down -v

# Start fresh (database will re-initialize from SQL scripts)
docker compose up --build
```

⚠️ **Warning:** This deletes ALL database data, including any changes made since initialization.

---

## 16. How to Inspect Logs

```bash
# All services
docker compose logs

# Follow logs in real-time
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f mysql
docker compose logs -f frontend

# Last N lines
docker compose logs --tail=50 backend
```

---

## 17. How to Verify the API

```bash
# Health check
curl http://localhost:5000/api/health

# List hostels (public endpoint)
curl http://localhost:5000/api/hostels

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cloudstay.edu","password":"Admin@1234"}'

# Login as student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abena.mensah@student.edu","password":"Student@1234"}'
```

---

## 18. How to Verify Database State

```bash
# Enter MySQL container
docker exec -it cloudstay-mysql mysql -u root -pcloudstay_root_2024

# Inside MySQL:
SHOW DATABASES;
USE cloudstay;
SHOW TABLES;

SELECT COUNT(*) AS total_users    FROM users;
SELECT COUNT(*) AS total_hostels  FROM hostels;
SELECT COUNT(*) AS total_rooms    FROM rooms;
SELECT COUNT(*) AS total_bookings FROM bookings;

SHOW PROCEDURE STATUS WHERE Db = 'cloudstay';
SHOW FULL TABLES WHERE Table_type = 'VIEW';
SHOW TRIGGERS FROM cloudstay;
EXIT;
```

---

## 19. How AWS Deployment Differs from Local Docker

| Aspect | Local Docker | AWS |
|---|---|---|
| Database | MySQL container (your machine) | Amazon RDS (managed, persistent, backed up) |
| Storage | No S3 (S3 disabled) | Amazon S3 bucket for receipt uploads |
| Access | `localhost:5173` | Your domain via Nginx + HTTPS |
| Credentials | `.env` file | EC2 IAM role (no keys needed for S3) |
| Reliability | Single machine, no failover | Multi-AZ RDS, auto-backups |
| Monitoring | `docker compose logs` | AWS CloudWatch |

The application code is identical. Only environment variables and infrastructure change.

---

## 20. Security Considerations

**Secrets:**
- JWT secrets are never committed to git (`.gitignore` includes `.env`)
- Database passwords are injected at runtime via environment variables
- AWS credentials are never hardcoded — IAM roles are used on EC2

**Network:**
- MySQL is only accessible within the Docker network (not exposed externally)
- CORS is configured to only accept requests from `localhost:5173` (or your domain)
- Production uses HTTPS via Let's Encrypt

**Images:**
- Node 18 Alpine used (minimal attack surface)
- `--omit=dev` removes dev dependencies from production image
- `.dockerignore` prevents `.env` and `node_modules` from being copied into images

**Database:**
- Stored procedures prevent SQL injection at the database level
- bcrypt (cost factor 12) is used for all password hashing
- JWT access tokens expire in 1 hour; refresh tokens in 7 days
