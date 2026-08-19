# CloudStay — Development Roadmap & Milestones

## Project Overview

**Duration**: 10 weeks (5 sprints × 2 weeks)  
**Team Size**: 5 members  
**Methodology**: Agile Scrum with biweekly sprints  
**Repository**: GitHub (main branch protection, PR-based workflow)

---

## High-Level Roadmap

```
Week 1  ──── Week 2  ──── Week 3  ──── Week 4  ──── Week 5
  [Sprint 1: Foundation]    [Sprint 2: Core API]    [Sprint 3:
  Setup + Auth + DB         Booking + Hostel         Frontend]
                            CRUD + S3

Week 6  ──── Week 7  ──── Week 8  ──── Week 9  ──── Week 10
  [Sprint 3 cont.]          [Sprint 4: AWS]         [Sprint 5: QA]
  Frontend pages             Deployment + CW         Testing + Docs
```

---

## Milestones

| # | Milestone | Target Week | Deliverable |
|---|---|---|---|
| M1 | **Project Kickoff** | Week 1 | Repo setup, DB schema approved, env configured |
| M2 | **Auth Complete** | Week 2 | Register/Login working with JWT, bcrypt hashing |
| M3 | **Core API Complete** | Week 4 | Hostel + Booking CRUD, S3 upload endpoint |
| M4 | **Frontend MVP** | Week 6 | All pages functional, API integrated |
| M5 | **AWS Deployment** | Week 8 | App live on EC2, RDS connected, CloudWatch active |
| M6 | **QA Sign-off** | Week 9 | All test cases pass, no critical bugs open |
| M7 | **Final Submission** | Week 10 | Documentation complete, presentation ready |

---

## Sprint Breakdown

### Sprint 1 — Foundation (Week 1–2)

**Goal**: Working authentication and database foundation.

| Task | Owner | Priority |
|---|---|---|
| Initialise GitHub repo + branch protection | Member 4 | P0 |
| Create project folder structure | All | P0 |
| MySQL schema design & creation | Member 3 | P0 |
| Backend project scaffold (Express) | Member 2 | P0 |
| Frontend project scaffold (Vite + React) | Member 1 | P0 |
| User registration endpoint (`POST /api/auth/register`) | Member 2 | P0 |
| User login endpoint (`POST /api/auth/login`) | Member 2 | P0 |
| JWT middleware | Member 2 | P0 |
| AWS account setup + IAM users for team | Member 4 | P0 |
| Project proposal document | Member 5 | P1 |

**Definition of Done**:  
- [ ] User can register and receive a JWT  
- [ ] User can login with correct credentials  
- [ ] Invalid credentials return proper error  
- [ ] DB tables created and seeded  

---

### Sprint 2 — Core API (Week 3–4)

**Goal**: Full CRUD for hostels, rooms, and bookings.

| Task | Owner | Priority |
|---|---|---|
| Hostel CRUD endpoints | Member 3 | P0 |
| Room CRUD endpoints | Member 3 | P0 |
| Booking creation endpoint | Member 2 | P0 |
| Booking status update (admin) | Member 2 | P0 |
| S3 bucket provisioning | Member 4 | P0 |
| Payment receipt upload endpoint (S3) | Member 2 | P0 |
| Input validation (express-validator) | Member 2 | P0 |
| Error handling middleware | Member 2 | P0 |
| Role-based access control middleware | Member 2 | P1 |
| Swagger API documentation setup | Member 5 | P1 |
| RDS provisioning on AWS | Member 4 | P0 |

**Definition of Done**:  
- [ ] All CRUD endpoints return correct HTTP codes  
- [ ] S3 upload returns a permanent URL  
- [ ] Admin-only routes reject student tokens  
- [ ] RDS accessible from EC2 security group  

---

### Sprint 3 — Frontend (Week 5–6)

**Goal**: Complete React UI integrated with the API.

| Task | Owner | Priority |
|---|---|---|
| App routing (React Router) | Member 1 | P0 |
| Login & Register pages | Member 1 | P0 |
| Hostel browsing page | Member 1 | P0 |
| Room listing page | Member 1 | P0 |
| Booking form + submission | Member 1 | P0 |
| Payment receipt upload UI | Member 1 | P0 |
| Student dashboard (my bookings) | Member 1 | P0 |
| Admin dashboard | Member 1 | P0 |
| Responsive layout (mobile/tablet) | Member 1 | P1 |
| Loading states & error handling | Member 1 | P1 |
| Navbar & footer | Member 1 | P2 |
| Frontend build optimization | Member 1 | P2 |

**Definition of Done**:  
- [ ] All pages render on mobile (≥ 320px) and desktop  
- [ ] API calls succeed with JWT attached  
- [ ] Form validation shows user-friendly errors  
- [ ] Admin can approve/reject from dashboard  

---

### Sprint 4 — AWS Deployment (Week 7–8)

**Goal**: Production application deployed on AWS.

| Task | Owner | Priority |
|---|---|---|
| EC2 instance launch (Ubuntu 22.04) | Member 4 | P0 |
| Nginx install + reverse proxy config | Member 4 | P0 |
| PM2 setup + ecosystem config | Member 4 | P0 |
| Deploy backend to EC2 | Member 4 | P0 |
| Deploy frontend build to Nginx | Member 4 | P0 |
| Production `.env` on EC2 | Member 4 | P0 |
| Security Group rules (80, 443, 22) | Member 4 | P0 |
| IAM role for EC2 (S3 + CloudWatch) | Member 4 | P0 |
| CloudWatch Logs agent configuration | Member 4 | P0 |
| CloudWatch alarm (5xx errors) | Member 4 | P1 |
| Domain / Elastic IP assignment | Member 4 | P1 |
| Deployment runbook documentation | Member 4 | P1 |
| End-to-end smoke test on production | Member 5 | P0 |

**Definition of Done**:  
- [ ] App accessible via public IP/domain  
- [ ] Backend logs visible in CloudWatch  
- [ ] S3 upload works from production  
- [ ] DB connection stable from EC2  

---

### Sprint 5 — QA & Documentation (Week 9–10)

**Goal**: All tests passing, all documentation complete.

| Task | Owner | Priority |
|---|---|---|
| Unit test suite (Jest + Supertest) | Member 5 | P0 |
| Integration test — booking flow | Member 5 | P0 |
| Manual test checklist execution | Member 5 | P0 |
| Bug triage & fixes | All | P0 |
| User manual | Member 5 | P0 |
| Technical report | Member 5 | P0 |
| Presentation deck | All | P0 |
| Demo script | Member 5 | P1 |
| Individual contribution docs | All | P0 |
| Meeting minutes compilation | Member 5 | P1 |
| Final README review | All | P2 |

**Definition of Done**:  
- [ ] ≥ 80% test coverage on backend  
- [ ] Zero P0 open bugs  
- [ ] Documentation submitted  
- [ ] Presentation rehearsed  

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| RDS connection issues | Medium | High | Firewall rules tested early (Sprint 2) |
| AWS billing overrun | Low | Medium | Budget alerts; use Free Tier where possible |
| Team member unavailability | Medium | Medium | Tasks documented; PR reviews spread load |
| S3 CORS issues | Medium | Medium | Test S3 upload independently Sprint 2 |
| JWT expiry bugs | Low | High | Integration tests cover token refresh |
| Scope creep | High | Medium | Strict sprint backlog; PO approves additions |
