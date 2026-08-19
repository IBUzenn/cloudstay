# CloudStay — Master Test Plan

## 1. Testing Objectives
The primary goal of the CloudStay test strategy is to ensure system reliability, data integrity, security enforcement, and smooth user experience across student and administrative workflows.

## 2. Testing Scope
- **In-Scope**:
  - Express REST API endpoints (Auth, Hostels, Rooms, Bookings, Receipts).
  - Business logic services and MySQL database query operations.
  - Role-based authorization and JWT token security.
  - S3 file upload validation and mock integration.
  - React frontend user workflows and compilation.
  - Real AWS deployment environment validation.
- **Out-of-Scope**:
  - Load testing beyond single-instance operational limits.
  - Payment gateway transaction processing (receipt upload simulation used).

## 3. Testing Strategy & Distinction
1. **Automated Unit & Integration Testing**: Executes in Node.js via Jest and Supertest with database/AWS mocks.
2. **Frontend Quality Assurance**: Production bundle verification (`npm run build`) and manual workflow verification.
3. **AWS Deployment Validation**: Verification script and checklist applied against live AWS infrastructure (EC2, RDS, S3, CloudWatch).
4. **Manual Acceptance Testing**: Scenario-driven functional validation documented in `Acceptance-Test-Checklist.md`.

## 4. Testing Tools
- **Jest**: Unit and integration test runner.
- **Supertest**: Express API HTTP assertion framework.
- **Vite / ESLint**: Frontend build and static code linting.
- **GitHub Actions**: Continuous Integration pipeline.

## 5. Pass / Fail Criteria
- **Pass**: 100% of automated unit & integration test suites pass; production bundle compiles without errors; all critical security authorization checks pass.
- **Fail**: Any unhandled 500 error on valid requests, unauthorized access to admin routes, or failed build compilation.
