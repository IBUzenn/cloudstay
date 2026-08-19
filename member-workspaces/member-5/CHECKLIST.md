# QA & Documentation Checklist: Member 5

Use this checklist to track your progress on your assigned tasks.

## 1. Testing Setup
- [ ] Install backend dependencies (`backend/package.json`)
- [ ] Install frontend dependencies (`frontend/package.json`)
- [ ] Verify Jest is configured in both backend and frontend.

## 2. API Integration Testing (Backend)
- [ ] Create `backend/tests/api.test.js`.
- [ ] Write tests for Authentication API (Register, Login).
- [ ] Write tests for Booking API (Create, Read, Update Status).
- [ ] Write tests for Hostel API (List, Retrieve).
- [ ] Verify all backend tests pass (`npm run test` in backend).
- [ ] Save test run output screenshot to `evidence/backend_tests_pass.png`.

## 3. Component Testing (Frontend)
- [ ] Create `frontend/src/tests/BookingForm.test.jsx`.
- [ ] Write unit tests for `BookingForm` component.
- [ ] Create `frontend/src/tests/HostelList.test.jsx`.
- [ ] Write unit tests for `HostelList` component.
- [ ] Verify all frontend tests pass (`npm run test` in frontend).
- [ ] Save test run output screenshot to `evidence/frontend_tests_pass.png`.

## 4. Manual Acceptance Testing
- [ ] Define test cases for major user journeys.
- [ ] Execute manual testing on the fully integrated application.
- [ ] Document bugs found and verify fixes with relevant team members.
- [ ] Create `docs/testing/TEST_RESULTS.md` summarizing manual testing outcomes.

## 5. User Manual Documentation
- [ ] Draft `docs/report/USER_MANUAL.md`.
- [ ] Include clear instructions for Student role (Registration, Booking).
- [ ] Include clear instructions for Admin role (Managing Bookings).
- [ ] Add relevant screenshots of the UI to the manual.

## 6. Final Technical Report
- [ ] Draft `docs/report/TECHNICAL_REPORT.md`.
- [ ] Document System Architecture.
- [ ] Document Database Schema (incorporating Member 3's input).
- [ ] Summarize API Design (incorporating Member 2's input).
- [ ] Summarize Testing Strategy and Results.
- [ ] Verify the report uses "group authorship" language ("we", "the team").

## 7. Final Review & Submission
- [ ] Update `CONTRIBUTION.md` with a summary of your work.
- [ ] Ensure all required evidence is in the `evidence/` folder.
- [ ] Inform the project coordinator that your workspace tasks are complete.
