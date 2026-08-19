# CloudStay Student Hostel Booking System
## User Manual

**Document Version:** 1.0  
**System Version:** 1.0.0  
**Prepared by:** CloudStay Development Team  
**Date:** August 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Getting Started](#3-getting-started)
   - 3.1 [Accessing CloudStay](#31-accessing-cloudstay)
   - 3.2 [Creating a Student Account](#32-creating-a-student-account)
   - 3.3 [Logging In](#33-logging-in)
   - 3.4 [Logging Out](#34-logging-out)
4. [Student Guide](#4-student-guide)
   - 4.1 [Browsing Hostels](#41-browsing-hostels)
   - 4.2 [Viewing Hostel Details](#42-viewing-hostel-details)
   - 4.3 [Making a Booking](#43-making-a-booking)
   - 4.4 [Viewing Your Bookings (Dashboard)](#44-viewing-your-bookings-dashboard)
   - 4.5 [Uploading a Payment Receipt](#45-uploading-a-payment-receipt)
   - 4.6 [Cancelling a Booking](#46-cancelling-a-booking)
   - 4.7 [Your Profile](#47-your-profile)
5. [Administrator Guide](#5-administrator-guide)
   - 5.1 [Admin Dashboard](#51-admin-dashboard)
   - 5.2 [Managing Bookings](#52-managing-bookings)
   - 5.3 [Reviewing a Booking](#53-reviewing-a-booking)
   - 5.4 [Managing Hostels](#54-managing-hostels)
   - 5.5 [Managing Users](#55-managing-users)
6. [Manager Guide](#6-manager-guide)
7. [Troubleshooting](#7-troubleshooting)
8. [Frequently Asked Questions](#8-frequently-asked-questions)

---

## 1. Introduction

**CloudStay** is a web-based student hostel booking system that allows university students to browse available hostels, view room details, and submit accommodation booking requests online. Administrators and managers can review applications, approve or reject bookings, and manage hostel records through a dedicated dashboard.

This manual covers three types of users:

| User Type | Description |
|---|---|
| **Student** | University student seeking hostel accommodation |
| **Admin** | System administrator with full management access |
| **Manager** | Hostel manager with booking review permissions |

---

## 2. System Requirements

CloudStay is a web application that runs entirely in a modern browser. No software installation is required.

| Requirement | Minimum |
|---|---|
| **Browser** | Google Chrome 110+, Firefox 115+, Microsoft Edge 110+, Safari 16+ |
| **Internet Connection** | Required |
| **Screen Resolution** | 1280 × 720 or higher (responsive on mobile) |
| **JavaScript** | Must be enabled |

---

## 3. Getting Started

### 3.1 Accessing CloudStay

Open your browser and navigate to the CloudStay URL provided by your institution.

The **home page** displays a searchable listing of all available hostels. No login is required to browse hostels.

---

### 3.2 Creating a Student Account

> **Note:** Only students can self-register. Admin and Manager accounts are created by the system administrator.

**Steps:**

1. Click **Register** in the top navigation bar.
2. Fill in the registration form:

   | Field | Description |
   |---|---|
   | **Full Name** | Your full legal name |
   | **Email Address** | Your university email address |
   | **Student ID** | Your university student ID number |
   | **Password** | Minimum 8 characters |
   | **Confirm Password** | Must match the password field |

3. Click **Create Account**.
4. On success, you will be redirected to the **Login** page.

**Common Registration Errors:**

| Error Message | Cause |
|---|---|
| "An account with this email or student ID already exists." | Your email or student ID is already registered. Contact the administrator if this is unexpected. |
| Validation error on a field | The field does not meet the required format (e.g., password too short). |

---

### 3.3 Logging In

1. Click **Login** in the top navigation bar.
2. Enter your registered **Email Address** and **Password**.
3. Click **Sign In**.
4. On success, you will be redirected automatically:
   - **Students** → Student Dashboard (`/dashboard`)
   - **Admins** → Admin Dashboard (`/admin`)
   - **Managers** → Manager Dashboard (`/manager`)

**Troubleshooting Login:**

| Error | Cause |
|---|---|
| "Invalid email or password." | Incorrect credentials. Double-check your email and password. |
| "Your account has been deactivated." | Contact the system administrator. |
| "Too many login attempts." | Wait 15 minutes before trying again. |

---

### 3.4 Logging Out

Click your user icon or name in the navigation bar and select **Logout**. Your session will be terminated and you will be redirected to the home page.

---

## 4. Student Guide

### 4.1 Browsing Hostels

The **home page** (`/` or `/hostels`) displays a paginated card list of all active hostels.

**Each hostel card shows:**
- Hostel name and location
- Number of available rooms
- Amenities (e.g., WiFi, Laundry, Air Conditioning)
- Contact information

**Filtering / Searching:**

Use the **search/filter bar** at the top of the listing page to narrow results by:
- **Location keyword** — filters hostels by location name or hostel name

Pagination controls appear at the bottom of the listing when there are multiple pages of results.

---

### 4.2 Viewing Hostel Details

Click on any hostel card to open the **Hostel Detail Page** (`/hostels/:id`).

This page shows:
- Full hostel description
- Complete amenities list
- Contact email and phone number
- A table of all **available rooms**, including:
  - Room number
  - Room type (single / double / triple / suite)
  - Capacity
  - Price per semester
  - A **Book This Room** button

> **Note:** The "Book This Room" button is only visible to logged-in students. If you are not logged in, you will be prompted to log in first.

---

### 4.3 Making a Booking

1. On the Hostel Detail page, click **Book This Room** next to your chosen room.
2. You will be taken to the **Booking Form** (`/book/:roomId`).
3. Enter the required details:

   | Field | Description |
   |---|---|
   | **Check-in Date** | Your intended move-in date |
   | **Check-out Date** | Your intended move-out date (must be after check-in) |

4. Review the room details displayed on the form (room number, type, hostel, price).
5. Click **Submit Booking**.

**What happens next:**
- Your booking is created with a status of **Pending**.
- It will appear immediately in your **Dashboard**.
- An administrator or manager must review and approve or reject your booking.

**Business Rules:**
- You may only have **one active or pending booking** at a time. To make a new booking, cancel or wait for rejection of the existing one.
- If the room becomes unavailable between browsing and submitting, you will receive a conflict error. Please choose another room.

---

### 4.4 Viewing Your Bookings (Dashboard)

After logging in, students are taken to the **Student Dashboard** (`/dashboard`).

The dashboard displays a list of all your bookings, each showing:
- Hostel and room details
- Check-in and check-out dates
- Booking status badge

**Booking Statuses:**

| Status | Meaning |
|---|---|
| **Pending** | Your booking is awaiting admin or manager review |
| **Approved** | Your accommodation is confirmed |
| **Rejected** | Your booking was not approved. You may make a new booking. |
| **Cancelled** | You cancelled this booking |

Click on a booking entry to view its full detail page.

---

### 4.5 Uploading a Payment Receipt

Once your booking has been submitted (or approved), you may upload a payment receipt as proof of payment.

1. From the **Dashboard** or **Booking Detail** page, click **Upload Receipt**.
2. You will be taken to the **Upload Receipt** page (`/bookings/:id/upload`).
3. Click **Choose File** and select your receipt file.

   **Accepted file types:** JPEG (`.jpg`), PNG (`.png`), PDF (`.pdf`)  
   **Maximum file size:** 5 MB

4. Click **Upload**.
5. On success, a confirmation is shown and the receipt is securely stored.

> **Note:** You cannot upload a receipt for a **cancelled** booking.

---

### 4.6 Cancelling a Booking

You may cancel a booking that is in **Pending** or **Approved** status.

1. Navigate to your **Dashboard** or open the **Booking Detail** page.
2. Click the **Cancel Booking** button.
3. Confirm the cancellation when prompted.

**Effect of cancellation:**
- The booking status changes to **Cancelled**.
- If the booking was **Approved**, the room is returned to **Available** status, making it bookable by other students.

---

### 4.7 Your Profile

Click **Profile** in the navigation bar to access your **Profile Page** (`/profile`).

The profile page displays your account information:
- Full name
- Email address
- Student ID
- Account role

> **Note:** In the current version, profile editing is not available through the UI. Contact your administrator for account changes such as password resets.

---

## 5. Administrator Guide

Admin accounts have full system access. Log in with your admin credentials to access the **Admin Dashboard**.

### 5.1 Admin Dashboard

The **Admin Dashboard** (`/admin`) provides a high-level summary of system activity, including total users, total bookings, and a breakdown by booking status.

The navigation provides access to:
- Bookings management
- Hostel management
- User management

---

### 5.2 Managing Bookings

Navigate to **Admin → Bookings** (`/admin/bookings`) to see a full list of all booking records in the system.

The list shows:
- Booking ID
- Student name and student number
- Hostel and room details
- Check-in / check-out dates
- Current status
- Submission date

**Filtering:** You can filter bookings by status and/or hostel to narrow down the view.

Click on any booking row to open the **Booking Review** page.

---

### 5.3 Reviewing a Booking

The **Booking Review** page (`/admin/bookings/:id`) displays the full details of a booking including the student's uploaded payment receipt (if provided).

**Available actions:**

| Action | Requirements | Effect |
|---|---|---|
| **Approve** | Booking must be `Pending` | Status → `Approved`; Room status → `Booked` |
| **Reject** | Booking must be `Pending` | Status → `Rejected`; Room status → `Available` |
| **Cancel** | Booking must be `Pending` or `Approved` | Status → `Cancelled`; Room returns to `Available` |

**Optional:** Enter a **Review Note** before approving or rejecting to record the reason for your decision. This note is stored against the booking record.

> **Status Transition Rules:** Only valid transitions are permitted by the system. For example, a booking in `Rejected` status cannot be re-approved. Invalid transitions will be blocked.

---

### 5.4 Managing Hostels

Navigate to **Admin → Hostels** (`/admin/hostels`) to manage hostel records.

**Available operations:**
- **View** all hostels (including inactive ones)
- **Create** a new hostel (provide name, location, description, amenities, contact details)
- **Edit** an existing hostel's information
- **Deactivate** a hostel — soft-delete that hides the hostel from the public listing

> **Deactivation Rule:** A hostel cannot be deactivated if it has any active (`Pending` or `Approved`) bookings. Resolve those bookings first.

---

### 5.5 Managing Users

Navigate to **Admin → Users** (`/admin/users`) to view all registered users.

The table displays:
- User name and email
- Student ID (if applicable)
- Role (student / manager / admin)
- Account status (Active / Inactive)

**Available actions:**
- **Toggle user status** — activate or deactivate a user account. Deactivated accounts cannot log in and will receive a "Your account has been deactivated" error.

> **Note:** Admin and Manager account creation is performed directly in the database by a system administrator using the provided seed scripts or direct SQL access.

---

## 6. Manager Guide

Managers have a subset of admin permissions focused on booking review.

**Manager Dashboard** (`/manager`): Overview of booking activity for the manager's area.

**Managers can:**
- View all bookings (`/admin/bookings`) — the same view as admin
- Review individual bookings and **Approve** or **Reject** them (`/admin/bookings/:id`)

**Managers cannot:**
- Manage hostel records (`/admin/hostels` — admin only)
- Manage user accounts (`/admin/users` — admin only)
- View system-wide admin statistics

---

## 7. Troubleshooting

| Problem | Solution |
|---|---|
| **Page shows "403 Forbidden"** | You are attempting to access a page your role does not permit. Use the navigation to go to your correct section. |
| **Page shows "404 Not Found"** | The URL does not exist. Return to the home page and navigate from there. |
| **"Too many requests" error** | The system rate limiter has been triggered (100 requests per 15 minutes globally; 10 login attempts per 15 minutes). Wait and try again. |
| **File upload fails** | Ensure your file is JPEG, PNG, or PDF and is no larger than 5 MB. |
| **Booking form shows "Room is no longer available"** | Another student booked the same room between the time you opened the detail page and submitted the form. Return to the hostel listing and choose another room. |
| **Cannot see the booking form** | You must be logged in as a **student** to book a room. Admin and manager accounts cannot make personal bookings. |
| **"Access token has expired"** | Your session has timed out. Log out and log back in to obtain a new session. |
| **Cannot cancel a booking** | Bookings in `Approved` or `Pending` status can be cancelled. `Rejected` and `Cancelled` bookings cannot be cancelled again. |

---

## 8. Frequently Asked Questions

**Q: Can I make more than one booking at a time?**  
A: No. The system allows only one active (`Pending` or `Approved`) booking per student at a time. You must cancel your current booking or wait for it to be rejected before making a new one.

**Q: What payment methods are accepted?**  
A: CloudStay does not process payments directly. Students make payment through the institution's designated payment channel and then upload a receipt (image or PDF) as proof of payment through the system.

**Q: How long does booking approval take?**  
A: Approval timelines are at the discretion of your institution's administration. Check your dashboard regularly for status updates.

**Q: Can I change my check-in or check-out dates after booking?**  
A: Date modification is not supported in the current version. Cancel the existing booking and submit a new one with the correct dates.

**Q: I forgot my password. What should I do?**  
A: Self-service password reset is not available in the current version. Contact your system administrator to have your password reset.

**Q: Is my data secure?**  
A: Yes. Passwords are stored as bcrypt hashes (never in plain text). All communication uses HTTPS. Payment receipts are stored privately in AWS S3 with server-side encryption (AES-256). JWT access tokens expire after 1 hour.

**Q: What browsers are supported?**  
A: CloudStay supports all modern browsers including Chrome, Firefox, Edge, and Safari. Internet Explorer is not supported.

---

*CloudStay Student Hostel Booking System — User Manual v1.0*  
*© 2026 CloudStay Development Team*
