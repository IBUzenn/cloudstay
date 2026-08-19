# Member 1 — Task Specifications

## Task List Summary

- `M1-FE-001`: Client Routing & Role Guards Setup
- `M1-FE-002`: Authentication State & Axios Interceptor
- `M1-FE-003`: Public Hostel Browsing & Detail Pages
- `M1-FE-004`: Student Booking Creation & Receipt Upload Pages
- `M1-FE-005`: Admin Management Dashboards & Review Pages

---

### Task M1-FE-001
- **Task ID:** M1-FE-001
- **Task:** Implement client-side routing, navigation layout, and role-based route guards.
- **Purpose:** Protect private pages based on user authentication and role (Student, Manager, Admin).
- **Files involved:**
  - `frontend/src/App.jsx`
  - `frontend/src/components/layout/Navbar.jsx`
  - `frontend/src/components/layout/Footer.jsx`
- **Prerequisites:** `react-router-dom` installed in `frontend/package.json`.
- **Implementation instructions:**
  - Configure `Routes` in `App.jsx` for `/`, `/hostels`, `/hostels/:id`, `/login`, `/register`, `/dashboard`, `/book/:roomId`, `/bookings/:id`, `/bookings/:id/upload`, `/profile`, `/admin`, `/admin/bookings`, `/admin/bookings/:id`, `/admin/hostels`, `/admin/users`, `/manager`, `/403`.
  - Create `ProtectedRoute` checking `loading`, `user`, and allowed `roles`.
  - Create `GuestRoute` redirecting authenticated users to their dashboard.
- **Expected result:** Unauthenticated access to `/dashboard` redirects to `/login`. Non-admin access to `/admin` redirects to `/403`.
- **Testing requirement:** Test navigating directly to `/admin` as a student user; verify redirection to `/403`.
- **Completion criteria:** All client routes render without console errors; route guards correctly enforce permissions.
- **Dependency:** None.

---

### Task M1-FE-002
- **Task ID:** M1-FE-002
- **Task:** Build global `AuthContext` and configure Axios API client.
- **Purpose:** Manage JWT tokens and session state across all frontend components.
- **Files involved:**
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/api/axios.js`
- **Prerequisites:** Backend auth endpoints available (Member 2).
- **Implementation instructions:**
  - Configure Axios instance with `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
  - Add request interceptor to attach `Authorization: Bearer <accessToken>` from `localStorage`.
  - Provide `login()`, `logout()`, `user`, and `loading` state via React Context.
- **Expected result:** Logging in stores tokens in `localStorage` and updates global UI navbar state.
- **Testing requirement:** Perform login with valid credentials; inspect `localStorage` for `accessToken` and `refreshToken`.
- **Completion criteria:** Tokens correctly attached to outgoing requests; logout clears tokens and state.
- **Dependency:** Member 2 (`/api/auth/login`, `/api/auth/register`).

---

### Task M1-FE-003
- **Task ID:** M1-FE-003
- **Task:** Build public `HostelListingPage` and `HostelDetailPage`.
- **Purpose:** Allow prospective students to view available hostels, room types, pricing, and amenities without logging in.
- **Files involved:**
  - `frontend/src/pages/public/HostelListingPage.jsx`
  - `frontend/src/pages/public/HostelDetailPage.jsx`
  - `frontend/src/components/hostel/HostelCard.jsx`
- **Prerequisites:** Member 2 hostel endpoints (`GET /api/hostels`, `GET /api/hostels/:id`).
- **Implementation instructions:**
  - Build paginated card grid displaying hostel name, location, amenities, and available room counts.
  - Implement location search filter state calling `GET /api/hostels?location=...`.
  - On detail page, render room list table with "Book This Room" buttons linking to `/book/:roomId`.
- **Expected result:** Hostel cards render cleanly; selecting a filter updates the list; room table shows room status.
- **Testing requirement:** Test empty search results, single hostel view, and "Book This Room" click behavior when unauthenticated.
- **Completion criteria:** Pages load data from backend cleanly; responsive on mobile and desktop views.
- **Dependency:** Member 2 (`GET /api/hostels`, `GET /api/hostels/:id`).

---

### Task M1-FE-004
- **Task ID:** M1-FE-004
- **Task:** Implement `BookingForm`, `StudentDashboard`, `BookingDetail`, and `UploadReceiptPage`.
- **Purpose:** Enable logged-in students to create room bookings, upload payment receipts, cancel bookings, and track status.
- **Files involved:**
  - `frontend/src/pages/student/BookingForm.jsx`
  - `frontend/src/pages/student/StudentDashboard.jsx`
  - `frontend/src/pages/student/BookingDetail.jsx`
  - `frontend/src/pages/student/UploadReceiptPage.jsx`
- **Prerequisites:** Member 2 booking endpoints (`POST /api/bookings`, `GET /api/bookings/my`, `POST /api/bookings/:id/receipt`).
- **Implementation instructions:**
  - Build `BookingForm` collecting check-in and check-out dates; validate check-out > check-in.
  - Render list of student's bookings with status badges (`Pending`, `Approved`, `Rejected`, `Cancelled`) on `StudentDashboard`.
  - Build `UploadReceiptPage` with file selector accepting `.jpg`, `.png`, `.pdf` up to 5MB (`multipart/form-data`).
- **Expected result:** Submitting a booking redirects to dashboard showing `Pending` status; receipt upload sends file to backend.
- **Testing requirement:** Create booking, view on dashboard, upload image receipt, and click cancel booking.
- **Completion criteria:** Full student flow works end-to-end against local backend.
- **Dependency:** Member 2 (`POST /api/bookings`, `POST /api/bookings/:id/receipt`, `PUT /api/bookings/:id/cancel`).

---

### Task M1-FE-005
- **Task ID:** M1-FE-005
- **Task:** Implement `AdminDashboard`, `AdminBookings`, `AdminBookingReview`, `AdminHostels`, and `AdminUsers`.
- **Purpose:** Provide administrative oversight for reviewing bookings, managing hostels, and toggling user account status.
- **Files involved:**
  - `frontend/src/pages/admin/AdminDashboard.jsx`
  - `frontend/src/pages/admin/AdminBookings.jsx`
  - `frontend/src/pages/admin/AdminBookingReview.jsx`
  - `frontend/src/pages/admin/AdminHostels.jsx`
  - `frontend/src/pages/admin/AdminUsers.jsx`
  - `frontend/src/pages/admin/ManagerDashboard.jsx`
- **Prerequisites:** Member 2 admin endpoints (`GET /api/admin/stats`, `GET /api/bookings`, `PUT /api/bookings/:id/status`, `GET /api/admin/users`).
- **Implementation instructions:**
  - Display summary cards on `AdminDashboard` (total users, total bookings, status counts).
  - Implement booking review page with Approve, Reject, and Cancel action buttons and review note text area.
  - Implement hostel management form (Create/Edit hostel) and user account status toggle button.
- **Expected result:** Admins can view all bookings, review receipt image, and approve/reject bookings; status updates immediately.
- **Testing requirement:** Log in as admin, approve a pending booking with a review note, and check room status sync.
- **Completion criteria:** Admin workflows pass without error; frontend build succeeds via `npm run build`.
- **Dependency:** Member 2 Admin & Booking status endpoints.
