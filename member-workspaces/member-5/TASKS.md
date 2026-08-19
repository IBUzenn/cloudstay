# Assigned Tasks: Member 5

This document outlines your specific tasks for the CloudStay project.

## Task 1: API Integration Testing (Backend)
- **Goal:** Verify that the backend API endpoints function correctly and handle errors appropriately.
- **Action Items:**
  - Implement integration tests using Jest and Supertest in the `backend/tests/` directory.
  - Test authentication flows (registration, login, invalid credentials).
  - Test booking flows (create booking, get bookings, update status) and authorization rules.
  - Test hostel data retrieval and filtering.
- **Relevant Files:**
  - `backend/tests/api.test.js` (Create this file)
  - `backend/routes/` (Reference for endpoints)

## Task 2: Component Testing (Frontend)
- **Goal:** Verify that key React components render correctly and handle user interactions.
- **Action Items:**
  - Implement unit tests using Jest and React Testing Library in the `frontend/src/tests/` directory.
  - Test the `BookingForm` component (validation, submission).
  - Test the `HostelList` component (rendering, filtering).
- **Relevant Files:**
  - `frontend/src/tests/BookingForm.test.jsx` (Create this file)
  - `frontend/src/tests/HostelList.test.jsx` (Create this file)
  - `frontend/src/components/` (Reference for components)

## Task 3: Manual Acceptance Testing
- **Goal:** Perform end-to-end testing of the fully integrated system.
- **Action Items:**
  - Define a comprehensive Acceptance Test Plan.
  - Execute test scripts covering major user journeys (Student booking a room, Admin managing bookings).
  - Document test results, bugs found, and resolution status.
- **Deliverables:**
  - `docs/testing/TEST_PLAN.md`
  - `docs/testing/TEST_RESULTS.md`

## Task 4: User Manual Documentation
- **Goal:** Create a comprehensive guide for end-users of the CloudStay system.
- **Action Items:**
  - Write step-by-step instructions for Students (registration, searching hostels, booking).
  - Write step-by-step instructions for Administrators (managing hostels, updating booking statuses).
  - Include screenshots or diagrams to aid understanding.
- **Relevant Files:**
  - `docs/report/USER_MANUAL.md` (Update existing file or create if missing)

## Task 5: Final Technical Report
- **Goal:** Synthesize the group's work into a professional capstone project report.
- **Action Items:**
  - Document the system architecture, design decisions, and database schema.
  - Describe the development process and technologies used.
  - Summarize testing strategies and results.
  - **CRITICAL:** Ensure the report reflects collective authorship (use "our team", "we designed", etc. - avoid "I built").
- **Relevant Files:**
  - `docs/report/TECHNICAL_REPORT.md` (Update existing file or create if missing)
