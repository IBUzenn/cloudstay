# CloudStay — Acceptance Test Checklist

Manual test scenarios for confirming system functionality prior to deployment releases.

| Test ID | Feature | Preconditions | Steps | Expected Result | Actual Result | Status | Tester | Date |
|---|---|---|---|---|---|---|---|---|
| TC-ACC-01 | Student Registration | System is operational; email not registered | 1. Navigate to `/register`<br>2. Enter valid details<br>3. Click Submit | User account created, redirected to `/login` with success toast | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-02 | Student Login | Registered student account exists | 1. Navigate to `/login`<br>2. Enter email & password<br>3. Click Login | Authenticated, JWT token stored, redirected to `/dashboard` | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-03 | Hostel Browsing | Seeded hostels exist in database | 1. Navigate to `/hostels`<br>2. View hostel grid | List of active hostels displayed with location & available rooms | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-04 | Hostel Filtering | Hostels in different locations exist | 1. Enter keyword in search bar<br>2. Apply filter | Only matching hostels displayed in results | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-05 | Hostel Details | Active hostel selected | 1. Click hostel card<br>2. Inspect details | Full description, amenities, and room availability displayed | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-06 | Room Booking | Authenticated as student; available room exists | 1. Click "Book Now"<br>2. Select check-in & check-out dates<br>3. Submit | Booking created with status `pending`, redirected to booking detail | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-07 | Booking Conflict | Student has active/pending booking | 1. Attempt to book a second room | Error message displayed: active booking already exists | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-08 | Receipt Upload | Student has pending booking | 1. Open booking detail<br>2. Select valid receipt file (PDF/PNG)<br>3. Upload | Receipt uploaded to S3, URL saved, success toast shown | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-09 | Student Viewing Booking | Student has submitted booking | 1. Open `/dashboard`<br>2. Click booking card | Detailed view shows status, dates, and uploaded receipt link | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-10 | Admin Login | Admin account credentials available | 1. Navigate to `/login`<br>2. Enter admin credentials | Login succeeds, redirected to `/admin` dashboard | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-11 | Admin Viewing Bookings | Pending bookings exist in system | 1. Open `/admin/bookings` | All student bookings displayed with status filters | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-12 | Admin Approving Booking | Pending booking with receipt exists | 1. Review booking<br>2. Click "Approve" | Booking status updated to `approved` | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-13 | Admin Rejecting Booking | Pending booking exists | 1. Review booking<br>2. Enter note & click "Reject" | Status updated to `rejected`, room freed up for booking | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-14 | Student Status Update | Admin approved/rejected booking | 1. Student logs in<br>2. Views booking detail | Student sees updated status (`approved` / `rejected`) | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
| TC-ACC-15 | Logout | User authenticated | 1. Click "Logout" button | JWT tokens cleared from storage, redirected to `/login` | To be completed during manual testing | Pending | QA Team | 2026-08-14 |
