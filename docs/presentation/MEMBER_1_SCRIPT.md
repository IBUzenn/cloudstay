# CloudStay Presentation Script — Member 1: Team Lead & Frontend Architect

> **Speaker**: Member 1 (Team Lead & Frontend Architect)  
> **Duration**: ~3.5 to 4 minutes  
> **Focus**: Project Overview, Requirements, React 18 SPA Architecture, UI Component Design, and Client-Side State Management

---

## 🎙️ Spoken Presentation Script

### 1. Opening & System Context (0:00 - 0:45)
"Good morning, everyone. My name is Member 1, and I served as the Team Lead and Frontend Architect for the CloudStay project. 

CloudStay is a cloud-native hostel booking web application designed to solve a very common problem on university campuses: the delay, lack of real-time visibility, and manual errors involved in finding and securing student accommodation.

Our team set out to build a platform that serves three distinct user roles:
First, **Students**, who can search available hostels, inspect individual rooms, submit booking applications, upload payment receipts, and track their booking status in real time.
Second, **Hostel Managers**, who oversee room inventory, review incoming applications, and approve or reject bookings for their assigned hostel.
And third, **System Administrators**, who maintain overall platform oversight, manage accounts, and view platform occupancy statistics."

---

### 2. Architecture & Tech Stack (0:45 - 1:45)
"From a frontend perspective, we chose **React 18** paired with **Vite 5** as our build tool. React allows us to construct a fast, modular Single Page Application, while Vite gives us instant Hot Module Replacement during development and optimized static assets for production.

Our client architecture is organized around four core principles:
1. **Centralized Routing**: Managed by `React Router v6` in `frontend/src/App.jsx`. We implemented role-based route guards that restrict unauthorized access. Guests can only access public listings, students are routed to their personal dashboard, and managers or admins are directed to administrative control panels.
2. **Global Authentication State**: Powered by `AuthContext.jsx` in `frontend/src/context/`. This context maintains the active user profile and JWT access tokens in client memory and `localStorage`, handling login, logout, and automatic session restoration.
3. **HTTP Axios Interceptors**: Configured in `frontend/src/api/axios.js`. Every outgoing API call automatically attaches the JWT Bearer token header, while an response interceptor gracefully handles token expiration and standardizes API error alerts.
4. **Responsive Component Design**: Built using custom Vanilla CSS tokens defined in `index.css`. We avoided bulky third-party UI frameworks to maintain full control over styling, rendering speed, and accessibility."

---

### 3. Screen Demonstration Instructions (1:45 - 3:00)
*[Action on Screen: Open browser to http://localhost:5173]*

"Let me demonstrate the student booking flow on screen.

Here on the landing page, students can immediately search hostels by location or amenities. Notice how the room counts update dynamically based on real-time database queries. 

When a student selects **Blue Block Hostel**, we navigate to `/hostels/1`, where available rooms—like room `BB-101`—are retrieved from our backend API. 

Clicking **Book Room** opens the booking form. Once submitted, the backend executes an atomic database transaction. The student is then directed to `/student/upload-receipt/1`, where they upload their bank receipt. This image is processed by our backend and stored directly in an **Amazon S3 bucket**. 

Finally, the student dashboard at `/student/dashboard` reflects the booking status as **Pending Review**."

---

### 4. Technical Security & Handoff (3:00 - 3:45)
"From a frontend security standpoint, we ensure that sensitive routes return a custom `ForbiddenPage` component if a student attempts to access `/admin/dashboard`. Additionally, input forms enforce client-side validation prior to network requests to prevent invalid payload submissions.

However, client-side security is only the first layer. All business logic, permission verification, and token issuance are strictly enforced on our backend API.

I will now hand over to **Member 2**, our Backend & Security Engineer, who will explain how our Express REST API handles authentication, security headers, and transactional concurrency."

---

## 📋 Member 1 Quick Reference

- **Key Files**: [`frontend/src/App.jsx`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/frontend/src/App.jsx), [`frontend/src/context/AuthContext.jsx`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/frontend/src/context/AuthContext.jsx), [`frontend/src/api/axios.js`](file:///d:/project/workspace-019fd9d2-5d23-7f48-a670-ef2224de5516/CloudStay/frontend/src/api/axios.js)
- **Key Concepts**: SPA routing, JWT bearer interceptor, AuthContext state management, responsive UI components.
- **Screen Focus**: `http://localhost:5173` landing page, hostel filter, student booking form.
