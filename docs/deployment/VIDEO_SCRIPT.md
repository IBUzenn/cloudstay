# CloudStay — Video Presentation Script

---

## INTRODUCTION

*[Face camera, relaxed tone]*

"Good morning/afternoon everyone. Today I'm going to walk you through how our team dockerized CloudStay — a university hostel booking system — so that the entire application can be started with a single command on any machine."

"By the end of this demo, you'll see the frontend, the backend API, and the MySQL database all running as Docker containers, communicating with each other, fully initialized with real data."

"Let me start with a quick architecture overview."

---

## PROJECT ARCHITECTURE

*[Switch to diagram or slide]*

"CloudStay has three main components."

"First — the **frontend**. This is a React 18 application, built with Vite. Students use it to browse hostels, view rooms, and make bookings. Managers and admins use it to review and approve those bookings."

"Second — the **backend**. This is a Node.js Express REST API. It handles authentication with JWT tokens, manages all booking logic, and talks to the database through stored procedures."

"Third — the **database**. This is MySQL 8.0. It stores users, hostels, rooms, bookings, and refresh tokens. We have triggers that automatically update room counts, and views that simplify complex queries."

"In a normal local setup, you'd have to install all of this manually, configure environment variables, run SQL scripts in the right order, and make sure everything starts at the right time. That's a lot of friction."

"Docker removes all of that friction."

---

## DOCKERIZATION

*[Open terminal, show the project structure]*

"Let me show you the files we created."

*[Show docker-compose.yml]*

"This is our `docker-compose.yml`. It defines three services: `mysql`, `backend`, and `frontend`. With this single file, Docker knows exactly how to build, configure, and connect all three."

*[Show backend Dockerfile]*

"This is the backend Dockerfile. We use Node 18 Alpine — a minimal Linux image — to keep the image small. We install only production dependencies using `npm ci --omit=dev`, then copy the source code. We also use `dumb-init` to ensure the container handles shutdown signals correctly."

*[Show frontend Dockerfile]*

"The frontend uses a **multi-stage build**. Stage 1 uses Node to run `vite build` and produce a static bundle. Stage 2 takes only those static files and puts them into an Nginx image. The final image has no Node.js in it — just Nginx serving HTML, CSS, and JavaScript. Much smaller and more secure."

---

## DATABASE

*[Show docker-compose.yml MySQL section]*

"The MySQL service uses the official MySQL 8.0 image. We mount three SQL files into the container's initialization directory."

*[Show the mounted paths in compose]*

"MySQL automatically runs these scripts alphabetically when the database volume is first created. So `01-schema.sql` runs first — creating all our tables, triggers, and views. Then `02-procedures.sql` creates the stored procedures. Then `03-seeds.sql` inserts the test data."

"This gives us a fully initialized database automatically on first startup."

*[Show volume definition]*

"We also define a named volume called `mysql_data`. This persists the database contents even if the container is stopped or removed. The data lives on the host machine's disk, not inside the container."

"To completely reset the database, you run:"

```bash
docker compose down -v
docker compose up --build
```

"The `-v` flag removes the volume. On next startup, MySQL reinitializes from scratch."

---

## BACKEND

*[Show backend environment in docker-compose.yml]*

"Here's a critical detail. Notice this line:"

```yaml
DB_HOST: mysql
```

"Inside Docker, if the backend tried to connect to `localhost`, it would be connecting to itself — not to the MySQL container. Docker service names act as DNS hostnames on the internal network. So `mysql` resolves to the MySQL container's IP address."

"The backend reads this from `process.env.DB_HOST` in `database.js`. No code changes needed — just the right environment variable."

*[Show CORS origin setting]*

"We also configure CORS to allow requests from `http://localhost:5173` — the frontend's address as seen from the browser."

---

## FRONTEND

*[Show frontend Dockerfile ARG section]*

"The frontend has an interesting networking constraint. Vite bakes the API URL into the JavaScript bundle **at build time**. The value becomes part of the compiled JavaScript that runs in the user's browser."

"The browser runs on the host machine — outside Docker. It cannot resolve Docker service names like `backend`. It can only reach services through the host machine's ports."

"So the API URL must be `http://localhost:5000/api` — because Docker maps the backend container's port 5000 to the host's port 5000."

*[Draw or show the flow]*

```
Browser → localhost:5000 → [Docker port mapping] → backend container ✅
Browser → backend:5000  → [unknown host - FAILS]                     ❌
```

"This is why the VITE_API_BASE_URL is passed as a Docker **build argument**, not a runtime environment variable."

---

## LOCAL DEPLOYMENT

*[Switch to terminal]*

"Let me show you the actual deployment."

*[Run the command]*

```bash
docker compose up --build
```

*[Narrate what's happening in the logs]*

"You can see Docker is building the backend image... now the frontend image... the Vite build is compiling the React application..."

"MySQL is starting... running the initialization scripts... schema created... procedures loaded... seed data inserted..."

"And now the backend is connecting to MySQL at `mysql:3306`... connected successfully... API running on port 5000."

"Let me verify in the browser."

*[Open http://localhost:5173]*

"The frontend is live. Let me navigate to the login page..."

*[Open http://localhost:5000/api/health]*

"And the backend health endpoint confirms the API is running."

*[Run curl to test login]*

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cloudstay.edu","password":"Admin@1234"}'
```

"We get a JWT access token back. The authentication is working."

*[Run hostel listing]*

```bash
curl http://localhost:5000/api/hostels
```

"Four hostels returned from the database — exactly what we seeded."

*[Enter MySQL container]*

```bash
docker exec -it cloudstay-mysql mysql -u root -pcloudstay_root_2024
```

```sql
USE cloudstay;
SELECT COUNT(*) FROM users;     -- 10
SELECT COUNT(*) FROM hostels;   -- 4
SELECT COUNT(*) FROM rooms;     -- 29
SELECT COUNT(*) FROM bookings;  -- 8
SHOW PROCEDURE STATUS WHERE Db = 'cloudstay';
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

"Ten users, four hostels, twenty-nine rooms, eight bookings — all initialized perfectly from our SQL scripts."

---

## TESTING

*[Show backend test command]*

"The backend has Jest unit tests and integration tests."

```bash
cd backend
npm test
```

*[Show results as they appear]*

"The unit tests cover the auth service, booking service, and hostel service."
"The integration tests cover the full API endpoints using Supertest."

---

## AWS DEPLOYMENT ARCHITECTURE

*[Switch to diagram or AWS slide]*

"For production, we'd move from local Docker to AWS. The architecture is straightforward."

"Instead of a MySQL container, we'd use **Amazon RDS** — a managed MySQL service. RDS handles automated backups, multi-AZ failover, and patching. We just point `DB_HOST` to the RDS endpoint."

"Instead of leaving AWS credentials blank, we'd attach an **IAM Role** to the EC2 instance. The role gives the backend permission to upload files to S3 automatically — no access keys needed in the code."

"**Nginx** runs on the EC2 instance as a reverse proxy, terminating SSL and routing traffic to the frontend and backend containers."

"The application code is identical. Only the environment variables change."

```
LOCAL:                          AWS:
Browser                         Browser
  ↓ localhost:5173                ↓ https://your-domain.com
Frontend container              Nginx (EC2)
  ↓ localhost:5000                ↓ proxy to port 5000
Backend container               Backend container
  ↓ mysql:3306                    ↓ RDS endpoint:3306
MySQL container                 Amazon RDS MySQL
                                  + Amazon S3 (receipts)
```

---

## CONCLUSION

*[Face camera]*

"To summarize what we demonstrated:"

"— A complete three-service Docker environment for CloudStay"
"— Automatic database initialization from SQL scripts on first run"
"— Correct networking: DB_HOST=mysql inside Docker, localhost in the browser"
"— A multi-stage frontend build producing a minimal Nginx image"
"— All environment secrets managed through .env files, never hardcoded"
"— A clear path to AWS deployment with RDS, S3, and EC2"

"The entire application starts with one command:"

```bash
docker compose up --build
```

"Thank you."

---

## SEEDED ACCOUNTS FOR LIVE DEMO

| Role | Email | Password |
|---|---|---|
| Admin | admin@cloudstay.edu | Admin@1234 |
| Manager | manager.blueblock@cloudstay.edu | Admin@1234 |
| Student | abena.mensah@student.edu | Student@1234 |

---

## KEY COMMANDS CHEATSHEET

```bash
# Start everything
docker compose up --build

# Start in background
docker compose up --build -d

# Stop (keep database)
docker compose down

# Full reset (wipe database)
docker compose down -v && docker compose up --build

# View logs
docker compose logs -f backend
docker compose logs -f mysql

# Enter MySQL
docker exec -it cloudstay-mysql mysql -u root -pcloudstay_root_2024

# Check container health
docker compose ps

# Test API
curl http://localhost:5000/api/health
curl http://localhost:5000/api/hostels
```
