# CloudStay — UI Navigation Flow

## Application Navigation Map

```mermaid
flowchart TD
    A["🌐 Public Entry\n(Landing Page)"] --> B{"Authenticated?"}

    B -- No --> C["/login\nLogin Page"]
    B -- No --> D["/ or /hostels\nHostel Listing (Public)"]
    B -- Yes, Student --> S_DASH["Student Dashboard"]
    B -- Yes, Admin --> A_DASH["Admin Dashboard"]
    B -- Yes, Manager --> M_DASH["Manager Dashboard"]

    C --> E["POST /api/auth/login"]
    E --> F{"Role?"}
    F -- Student --> S_DASH
    F -- Admin --> A_DASH
    F -- Manager --> M_DASH

    C --> G["/register\nRegister Page"] --> H["POST /api/auth/register"] --> C

    %% Student Navigation
    subgraph STUDENT["Student Pages"]
        S_DASH["/dashboard\nMy Bookings Overview"]
        S_HOSTELS["/hostels\nBrowse Hostels"]
        S_HOSTEL_DETAIL["/hostels/:id\nHostel Detail + Rooms"]
        S_BOOK["/book/:roomId\nBooking Form"]
        S_BOOKING_DETAIL["/bookings/:id\nBooking Detail"]
        S_UPLOAD["/bookings/:id/upload\nUpload Receipt"]
        S_PROFILE["/profile\nMy Profile"]
    end

    S_DASH --> S_HOSTELS
    S_HOSTELS --> S_HOSTEL_DETAIL
    S_HOSTEL_DETAIL --> S_BOOK
    S_BOOK --> S_DASH
    S_DASH --> S_BOOKING_DETAIL
    S_BOOKING_DETAIL --> S_UPLOAD
    S_DASH --> S_PROFILE

    %% Admin Navigation
    subgraph ADMIN["Admin Pages"]
        A_DASH["/admin\nAdmin Dashboard"]
        A_HOSTELS["/admin/hostels\nManage Hostels"]
        A_HOSTEL_FORM["/admin/hostels/new\n/admin/hostels/:id/edit\nHostel Form"]
        A_ROOMS["/admin/hostels/:id/rooms\nManage Rooms"]
        A_BOOKINGS["/admin/bookings\nAll Bookings"]
        A_BOOKING_REVIEW["/admin/bookings/:id\nReview Booking"]
        A_USERS["/admin/users\nManage Users"]
    end

    A_DASH --> A_HOSTELS
    A_HOSTELS --> A_HOSTEL_FORM
    A_HOSTELS --> A_ROOMS
    A_DASH --> A_BOOKINGS
    A_BOOKINGS --> A_BOOKING_REVIEW
    A_DASH --> A_USERS

    %% Manager Navigation
    subgraph MANAGER["Manager Pages"]
        M_DASH["/manager\nManager Dashboard"]
        M_BOOKINGS["/manager/bookings\nHostel Bookings"]
        M_BOOKING_REVIEW["/manager/bookings/:id\nReview Booking"]
    end

    M_DASH --> M_BOOKINGS
    M_BOOKINGS --> M_BOOKING_REVIEW

    %% Error pages
    ERR_404["/404\nNot Found"]
    ERR_403["/403\nForbidden"]

    style S_DASH fill:#3b82f6,color:#fff
    style A_DASH fill:#8b5cf6,color:#fff
    style M_DASH fill:#10b981,color:#fff
    style ERR_404 fill:#ef4444,color:#fff
    style ERR_403 fill:#ef4444,color:#fff
```

---

## Page Inventory

### Public Pages (No Auth Required)

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Hero banner, CTA to browse hostels |
| `/login` | `LoginPage` | Email/password login form |
| `/register` | `RegisterPage` | Student registration form |
| `/hostels` | `HostelListingPage` | Browse all hostels with search/filter |
| `/hostels/:id` | `HostelDetailPage` | Hostel info + room list |
| `/404` | `NotFoundPage` | 404 error page |
| `/403` | `ForbiddenPage` | Access denied page |

---

### Student Pages (Auth: `student` role)

| Route | Component | Description |
|---|---|---|
| `/dashboard` | `StudentDashboard` | Active booking, quick stats |
| `/book/:roomId` | `BookingForm` | Book a specific room |
| `/bookings/:id` | `BookingDetail` | View booking details + status |
| `/bookings/:id/upload` | `UploadReceiptPage` | Upload payment receipt |
| `/profile` | `ProfilePage` | View/edit student profile |

---

### Admin Pages (Auth: `admin` role)

| Route | Component | Description |
|---|---|---|
| `/admin` | `AdminDashboard` | Summary stats: users, bookings, occupancy |
| `/admin/hostels` | `HostelManagement` | CRUD hostel list |
| `/admin/hostels/new` | `HostelForm` | Create new hostel |
| `/admin/hostels/:id/edit` | `HostelForm` | Edit hostel |
| `/admin/hostels/:id/rooms` | `RoomManagement` | CRUD rooms for hostel |
| `/admin/bookings` | `BookingManagement` | Filter/view all bookings |
| `/admin/bookings/:id` | `BookingReview` | Approve/reject with receipt view |
| `/admin/users` | `UserManagement` | List and toggle user status |

---

### Manager Pages (Auth: `manager` role)

| Route | Component | Description |
|---|---|---|
| `/manager` | `ManagerDashboard` | Pending booking count |
| `/manager/bookings` | `ManagerBookingList` | Bookings for this manager's hostel |
| `/manager/bookings/:id` | `ManagerBookingReview` | Approve/reject with receipt view |

---

## Protected Route Logic

```mermaid
flowchart LR
    A[Navigate to protected route] --> B{Token in\nlocalStorage?}
    B -- No --> C[Redirect to /login]
    B -- Yes --> D{Token\nexpired?}
    D -- Yes --> E[Attempt token refresh\nPOST /api/auth/refresh]
    E --> F{Refresh\nsucceeds?}
    F -- No --> C
    F -- Yes --> G[Store new accessToken]
    G --> H{User role\nmatches route?}
    D -- No --> H
    H -- No --> I[Redirect to /403]
    H -- Yes --> J[Render page component]
```

---

## Component Reuse Map

| Component | Used In |
|---|---|
| `BookingStatusBadge` | StudentDashboard, BookingDetail, AdminBookingList, ManagerBookingList |
| `HostelCard` | HostelListingPage, AdminDashboard |
| `RoomCard` | HostelDetailPage, RoomManagement |
| `BookingCard` | StudentDashboard, BookingManagement |
| `FileUploadDropzone` | UploadReceiptPage |
| `ConfirmModal` | Delete hostel, cancel booking, deactivate user |
| `LoadingSpinner` | All pages during API fetch |
| `ErrorAlert` | All forms, data fetch failures |
| `Pagination` | BookingManagement, UserManagement, HostelListing |
| `Navbar` | All pages (role-aware links) |
| `ProtectedRoute` | All authenticated routes |
