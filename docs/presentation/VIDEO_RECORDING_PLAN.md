# CloudStay — Video Presentation & Recording Plan

> **Purpose**: Production guide for recording the group presentation video for the CloudStay capstone submission.

---

## 🎬 Video Recording Logistics Overview

- **Target Video Duration**: 18 – 20 Minutes
- **Video Resolution**: 1080p (1920x1080) at 30 fps
- **Recording Tools**: OBS Studio / Zoom / Microsoft Teams
- **Screen Layout**: Split screen (Speaker Webcam in top right corner, Shared Screen taking 80% of window)
- **Audio Output**: Crystal clear mic input (noise suppression enabled)

---

## ⏱️ Video Timeline & Speaker Transitions

| Time Marker | Speaker | Focus Area | On-Screen Display | Transition Statement |
|---|---|---|---|---|
| **00:00 – 04:00** | **Member 1** | System Overview, SPA Architecture, React 18 UI | GitHub Repo, Browser at `http://localhost:5173`, `App.jsx` | *"I will now hand over to Member 2, our Backend & Security Engineer, to present our Express API and JWT security layer."* |
| **04:00 – 08:00** | **Member 2** | Express REST API, Dual JWT Auth, Bcrypt, Transactions | VS Code `auth.service.js` & `booking.service.js`, Postman/Terminal `curl` | *"I will now pass the presentation to Member 3, our DBA, to present our MySQL 8.0 schema and stored procedures."* |
| **08:00 – 12:00** | **Member 3** | MySQL 3NF Schema, Triggers, Views, Procedures | MySQL CLI inside container, `schema.sql`, `procedures.sql` | *"I will now hand over to Member 4, our DevOps Engineer, to present our Docker setup and AWS cloud architecture."* |
| **12:00 – 16:00** | **Member 4** | Docker Compose, AWS EC2/RDS/S3, Nginx Proxy, CI/CD | Terminal (`docker compose ps`), AWS Console, `.github/workflows/ci.yml` | *"I will now pass the presentation to Member 5, our QA & Docs Specialist, to demonstrate our test suite and documentation."* |
| **16:00 – 20:00** | **Member 5** | Automated Tests (33/33 PASS), User Manual, Wrap-up | Terminal (`npm test` output), `USER_MANUAL.md`, Final Summary Slide | *"Thank you for your time. Our team is now ready to take any questions from the panel."* |

---

## 🖥️ Screen Sharing & Visual Asset Checklist

### Member 1 Visuals
- GitHub Repository home page (`https://github.com/IBUzenn/cloudstay`)
- Browser landing page (`http://localhost:5173`)
- Filter hostels interface & room selection modal
- Code snippet: `frontend/src/context/AuthContext.jsx`

### Member 2 Visuals
- Terminal running `curl` login request returning JWT payload
- Code snippet: `backend/src/services/auth.service.js` (bcrypt & token signing)
- Code snippet: `backend/src/services/booking.service.js` (`FOR UPDATE` locking transaction)
- Postman/Terminal HTTP 401 unauthorized test

### Member 3 Visuals
- Terminal running MySQL CLI query: `SELECT COUNT(*) FROM users;`
- Code snippet: `database/schema.sql` (table foreign keys & trigger definitions)
- Code snippet: `database/procedures.sql` (`sp_create_booking` stored procedure)
- `SHOW PROCEDURE STATUS WHERE Db = 'cloudstay'` query output

### Member 4 Visuals
- Terminal running `docker compose ps` showing 3 healthy containers
- AWS Management Console showing EC2 instance and RDS MySQL database
- AWS S3 Console showing uploaded receipt objects in `receipts/{bookingId}/`
- Code snippet: `.github/workflows/ci.yml` and `frontend/nginx.conf`

### Member 5 Visuals
- Terminal executing `cd backend && npm test` displaying 33/33 tests passing
- Code snippet: `backend/tests/integration/auth.api.test.js`
- User Manual: `docs/report/USER_MANUAL.md`
- Master AWS Deployment Guide: `docs/deployment/AWS_DEPLOYMENT_GUIDE.md`

---

## 🎙️ Recording Guidelines for Speakers

1. **Pacing**: Speak at a clear, measured pace (~130 words per minute). Avoid rushing through code snippets.
2. **Cursor Control**: Keep mouse cursor steady when pointing to specific line numbers in VS Code or web elements.
3. **Seamless Transitions**: Use the exact transition statements provided in the timeline matrix to ensure a smooth handoff between speakers.
4. **Environment Check**: Ensure Docker containers are running cleanly (`docker compose up -d`) before hitting record.
