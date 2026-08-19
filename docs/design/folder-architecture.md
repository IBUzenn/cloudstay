# CloudStay — Folder Structure

```
CloudStay/
│
├── .github/
│   ├── workflows/                  # GitHub Actions CI/CD pipelines
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│   ├── proposal/                   # Proposal, roadmap, git workflow, tech justification
│   │   ├── project-proposal.md
│   │   ├── roadmap.md
│   │   ├── git-workflow.md
│   │   └── technology-justification.md
│   │
│   ├── design/                     # UML, ER, architecture diagrams (Mermaid)
│   │   ├── use-case-diagram.md
│   │   ├── activity-diagram.md
│   │   ├── sequence-diagram.md
│   │   ├── er-diagram.md
│   │   ├── class-diagram.md
│   │   ├── aws-architecture.md
│   │   ├── deployment-diagram.md
│   │   └── api-architecture.md
│   │
│   ├── deployment/                 # Deployment guides and runbooks
│   │   ├── deployment-guide.md
│   │   ├── api-reference.md
│   │   └── environment-setup.md
│   │
│   ├── report/                     # Final technical report and user manual
│   │   ├── technical-report.md
│   │   └── user-manual.md
│   │
│   ├── contributions/              # Individual member contribution docs
│   │   ├── Member1.md
│   │   ├── Member2.md
│   │   ├── Member3.md
│   │   ├── Member4.md
│   │   └── Member5.md
│   │
│   └── meeting-notes/              # Sprint retrospectives and standup notes
│       ├── sprint-1-kickoff.md
│       ├── sprint-2-review.md
│       ├── sprint-3-review.md
│       ├── sprint-4-review.md
│       └── sprint-5-retrospective.md
│
├── frontend/                       # React 18 + Vite 5 application
│   ├── public/
│   ├── src/
│   │   ├── api/                    # Axios instances & API call modules
│   │   ├── assets/                 # Static images, fonts
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Button, Input, Modal, Spinner, etc.
│   │   │   ├── layout/             # Navbar, Footer, Sidebar
│   │   │   └── booking/            # BookingCard, BookingForm, StatusBadge
│   │   ├── context/                # AuthContext, ThemeContext
│   │   ├── hooks/                  # useAuth, useBooking, useHostel
│   │   ├── pages/
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── student/            # Dashboard, Booking, Profile
│   │   │   ├── admin/              # AdminDashboard, ManageUsers, ManageBookings
│   │   │   └── public/             # HostelListing, HostelDetail, NotFound
│   │   ├── router/                 # React Router configuration
│   │   ├── store/                  # Zustand or Context state
│   │   ├── utils/                  # Formatters, validators, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                        # Node.js + Express.js API
│   ├── src/
│   │   ├── config/                 # DB connection, AWS SDK, app config
│   │   │   ├── database.js
│   │   │   ├── aws.js
│   │   │   └── app.js
│   │   ├── controllers/            # Route handlers (thin — delegate to services)
│   │   │   ├── auth.controller.js
│   │   │   ├── hostel.controller.js
│   │   │   ├── room.controller.js
│   │   │   ├── booking.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/               # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── hostel.service.js
│   │   │   ├── booking.service.js
│   │   │   └── upload.service.js
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── routes/                 # Express router definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── hostel.routes.js
│   │   │   ├── room.routes.js
│   │   │   ├── booking.routes.js
│   │   │   └── admin.routes.js
│   │   ├── validators/             # express-validator rule sets
│   │   │   ├── auth.validator.js
│   │   │   ├── hostel.validator.js
│   │   │   └── booking.validator.js
│   │   ├── utils/                  # Logger, response helpers
│   │   │   ├── logger.js
│   │   │   └── response.js
│   │   └── server.js               # Entry point
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── package.json
│   └── swagger.yaml
│
├── database/                       # MySQL schema, seeds, migrations
│   ├── schema.sql                  # Full DDL — tables, indexes, constraints
│   ├── seeds.sql                   # Seed data — hostels, rooms, admin user
│   ├── procedures.sql              # Stored procedures
│   └── migrations/                 # Versioned ALTER scripts
│       └── 001_initial.sql
│
├── aws/                            # AWS configuration and IAM policies
│   ├── iam/
│   │   ├── ec2-instance-policy.json
│   │   ├── s3-upload-policy.json
│   │   └── cloudwatch-policy.json
│   ├── cloudwatch/
│   │   └── cloudwatch-agent-config.json
│   ├── security-groups/
│   │   └── security-groups.md
│   └── nginx/
│       └── cloudstay.conf
│
├── scripts/                        # Utility shell scripts
│   ├── deploy.sh                   # Production deploy script
│   ├── setup-ec2.sh                # EC2 first-time setup
│   ├── db-backup.sh                # RDS backup trigger
│   └── pm2-start.sh                # PM2 startup script
│
├── README.md
├── .gitignore
└── LICENSE
```

## Directory Responsibilities

| Directory | Owner | Description |
|---|---|---|
| `frontend/` | Member 1 | All React/Vite UI code |
| `backend/` | Member 2 | Express API, auth, middleware |
| `database/` | Member 3 | SQL schema, seeds, stored procedures |
| `aws/` | Member 4 | IAM, CloudWatch, Nginx, security groups |
| `scripts/` | Member 4 | Deployment automation scripts |
| `docs/` | Member 5 | All project documentation |
| `.github/` | Member 4 | CI/CD workflows, issue templates |
