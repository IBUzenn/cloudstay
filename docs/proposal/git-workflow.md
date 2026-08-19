# CloudStay — Git Workflow & Branch Strategy

## Branching Model

CloudStay uses a **GitHub Flow** variant with structured feature branches, suitable for a 5-person academic team.

```
main
  └── develop
        ├── feature/auth-backend          (Member 2)
        ├── feature/db-schema             (Member 3)
        ├── feature/frontend-auth         (Member 1)
        ├── feature/booking-api           (Member 2)
        ├── feature/hostel-api            (Member 3)
        ├── feature/payment-upload        (Member 2)
        ├── feature/frontend-dashboard    (Member 1)
        ├── feature/aws-deployment        (Member 4)
        ├── feature/cloudwatch-logs       (Member 4)
        ├── feature/test-suite            (Member 5)
        ├── hotfix/booking-status-bug     (as needed)
        └── release/v1.0.0               (created at submission)
```

---

## Branch Naming Convention

```
<type>/<short-description>
```

| Type | Usage | Example |
|---|---|---|
| `feature/` | New feature or functionality | `feature/room-availability-check` |
| `fix/` | Bug fix in development | `fix/jwt-expiry-handling` |
| `hotfix/` | Critical production fix | `hotfix/booking-null-pointer` |
| `chore/` | Tooling, config, dependencies | `chore/add-eslint-config` |
| `docs/` | Documentation only | `docs/api-swagger-annotations` |
| `test/` | Tests only | `test/booking-integration-tests` |
| `release/` | Release candidate | `release/v1.0.0` |

---

## Protected Branches

| Branch | Protection Rules |
|---|---|
| `main` | Requires 2 PR reviews; no direct push; CI must pass; squash merge only |
| `develop` | Requires 1 PR review; CI must pass |

---

## Pull Request Process

1. **Branch from `develop`** — never branch from `main` directly.
2. **Write code** — follow coding standards (ESLint, Prettier).
3. **Self-review** — check your own diff before requesting review.
4. **Open PR** — use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
5. **CI passes** — lint + tests must be green.
6. **Code review** — at least 1 approving review required.
7. **Merge** — squash and merge into `develop`.
8. **Delete branch** — auto-delete after merge.

---

## Commit Message Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer: BREAKING CHANGE, closes #issue]
```

### Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature change |
| `test` | Adding or updating tests |
| `chore` | Build tools, dependencies |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |

### Examples

```bash
feat(auth): add JWT refresh token endpoint
fix(booking): handle concurrent booking race condition
docs(api): add Swagger annotations to hostel routes
chore(deps): upgrade express to 4.19.2
test(booking): add integration tests for booking flow
ci(deploy): add GitHub Actions EC2 deploy workflow
```

---

## Release Workflow

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. Bump version in package.json files
# backend/package.json and frontend/package.json

# 3. Final testing on release branch

# 4. Merge into main
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 — Final submission"
git push origin main --tags

# 5. Merge back into develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# 6. Delete release branch
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

---

## Task Allocation by Member

### Member 1 — Frontend Lead

| Branch | Tasks |
|---|---|
| `feature/frontend-scaffold` | Vite + React setup, routing, folder structure |
| `feature/frontend-auth` | Login, register pages, JWT storage |
| `feature/frontend-hostel` | Hostel browse, room listing |
| `feature/frontend-booking` | Booking form, confirmation UI |
| `feature/frontend-upload` | Payment receipt upload UI |
| `feature/frontend-dashboard` | Student & admin dashboards |
| `feature/frontend-responsive` | Mobile/tablet responsive pass |

---

### Member 2 — Backend Lead

| Branch | Tasks |
|---|---|
| `feature/backend-scaffold` | Express setup, folder structure, middleware |
| `feature/auth-backend` | Register, login, JWT generation, bcrypt |
| `feature/booking-api` | Booking CRUD endpoints |
| `feature/payment-upload` | S3 multer upload endpoint |
| `feature/role-middleware` | RBAC middleware, route protection |
| `feature/error-handling` | Global error handler, HTTP codes |

---

### Member 3 — Database & API

| Branch | Tasks |
|---|---|
| `feature/db-schema` | MySQL schema, indexes, constraints |
| `feature/db-seeds` | Seed data (hostels, rooms, admin user) |
| `feature/hostel-api` | Hostel CRUD endpoints |
| `feature/room-api` | Room CRUD, availability check |
| `feature/stored-procedures` | SP for room availability, booking summary |
| `feature/swagger-annotations` | OpenAPI docs on hostel/room routes |

---

### Member 4 — Cloud & DevOps

| Branch | Tasks |
|---|---|
| `feature/iam-setup` | IAM users, roles, least-privilege policies |
| `feature/ec2-deploy` | EC2 provisioning, Nginx, PM2 |
| `feature/rds-config` | RDS MySQL setup, security group |
| `feature/s3-bucket` | S3 bucket, CORS, bucket policy |
| `feature/cloudwatch-logs` | CloudWatch agent config, log groups |
| `feature/github-actions` | CI/CD pipeline YAML |

---

### Member 5 — QA, Testing & Documentation

| Branch | Tasks |
|---|---|
| `test/unit-tests` | Jest unit tests for backend services |
| `test/integration-tests` | Supertest API integration tests |
| `docs/proposal` | Project proposal document |
| `docs/user-manual` | End-user guide |
| `docs/technical-report` | Final technical report |
| `docs/meeting-notes` | Sprint meeting minutes |

---

## GitHub Repository Setup Checklist

- [ ] Create organisation or personal repo: `cloudstay`
- [ ] Set repo visibility: Private (during development) → Public (submission)
- [ ] Add all 5 members as collaborators with Write access
- [ ] Enable branch protection on `main` and `develop`
- [ ] Create `develop` branch from `main`
- [ ] Add PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Add Issue templates: Bug Report, Feature Request
- [ ] Enable GitHub Actions in repo settings
- [ ] Add repository secrets: `EC2_SSH_KEY`, `EC2_HOST`, `EC2_USER`
