# CloudStay — Manual Testing Checklist

Before releasing any version of CloudStay to production, perform the following manual test scenarios. Ensure that the database is seeded with initial data (see `docs/design/database-schema.md`).

## 1. Authentication & Authorization
- [ ] **Student Registration**: Register a new student account. Ensure validation works (e.g., weak passwords, invalid emails are rejected).
- [ ] **Student Login**: Login with the newly created student account. Verify a JWT token is generated and stored.
- [ ] **Admin Login**: Login with the default admin account. Verify redirection to the Admin Dashboard.
- [ ] **Role-Based Access Control (RBAC)**: 
  - Attempt to access `/admin` as a student (should redirect to 403 Forbidden).
  - Attempt to book a room as an Admin (should not be allowed, or "Login to Book" if not student).
- [ ] **Logout**: Click logout and verify the session is cleared and you are redirected to the login page.

## 2. Public / Guest Views
- [ ] **Hostel Listing**: Navigate to `/hostels`. Verify all active hostels are displayed.
- [ ] **Hostel Search**: Use the search bar to filter hostels by name or location.
- [ ] **Hostel Details**: Click on a hostel and verify its description, amenities, and available rooms load correctly.

## 3. Student Booking Flow
- [ ] **Room Selection**: As a student, view a hostel and click "Book Now" on an available room.
- [ ] **Booking Form**: Select a valid Check-in and Check-out date (Check-out > Check-in).
- [ ] **Booking Submission**: Submit the booking. Verify redirection to the Booking Detail page.
- [ ] **Booking Status**: The new booking status should be `pending`. The room availability count should decrease.
- [ ] **Receipt Upload**: On the Booking Detail page, upload a valid image/PDF receipt. Verify success message.
- [ ] **Booking Cancellation**: As a student, cancel a pending booking. Verify the room becomes available again.

## 4. Admin Management Flow
- [ ] **Admin Dashboard**: View total stats (Users, Hostels, Rooms, Bookings).
- [ ] **Manage Bookings**: View the list of all bookings. Use the status filter to find the pending booking created in Step 3.
- [ ] **Booking Review**: Click "Review" on the pending booking. 
  - Verify you can download/view the student's uploaded receipt.
  - Approve the booking. Verify the status changes to `approved`.
- [ ] **Manage Users**: Navigate to the Users section. Deactivate a student account.
- [ ] **Deactivated User Login**: Attempt to login as the deactivated student. It should fail.

## 5. File Uploads (S3)
- [ ] **Presigned URLs**: Verify that receipts uploaded by students are successfully stored in the S3 bucket and that clicking "View Receipt" opens the file.

## 6. Error Handling
- [ ] **404 Not Found**: Navigate to a random URL (e.g., `/invalid-path`). Ensure the 404 page is displayed.
- [ ] **API Errors**: Temporarily stop the backend server and try to load the frontend. Ensure a generic "Network Error" or "Something went wrong" toast appears instead of crashing.
