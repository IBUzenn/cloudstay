# Interfaces & Architecture Overview: Member 5

As the QA and Documentation lead, you need a high-level understanding of how the system components interact to test them effectively and document the architecture.

## System Architecture

CloudStay is a standard three-tier web application:
1.  **Presentation Tier (Frontend):** React + Vite. Communicates with the backend via RESTful APIs.
2.  **Application Tier (Backend):** Node.js + Express. Handles business logic, authentication, and routing.
3.  **Data Tier (Database):** MySQL. Stores persistent data (users, hostels, bookings).

## Key API Endpoints (For Testing)

You will need to write integration tests for these endpoints:

### Authentication
- `POST /api/auth/register`: Registers a new user. Expects `email`, `password`, `role`.
- `POST /api/auth/login`: Authenticates a user. Expects `email`, `password`. Returns a JWT token.

### Hostels
- `GET /api/hostels`: Retrieves a list of available hostels.
- `GET /api/hostels/:id`: Retrieves details for a specific hostel.

### Bookings
- `POST /api/bookings`: Creates a new booking. Requires an authenticated token. Expects `hostelId`, `checkIn`, `checkOut`.
- `GET /api/bookings`: Retrieves bookings for the authenticated user (or all bookings if admin).
- `PATCH /api/bookings/:id/status`: Updates a booking status (e.g., 'pending' to 'confirmed'). Requires admin authorization.

## Frontend Components (For Testing)

You will need to write component tests for:
- `BookingForm.jsx`: Ensure form validation works (e.g., check-in before check-out) and submission triggers the correct API call.
- `HostelList.jsx`: Ensure it renders correctly given mock data and handles filtering/sorting interactions.

## Documentation Standards

- **Tone:** Professional, objective, and academic.
- **Authorship:** Use collective terms ("the team", "we developed").
- **Formatting:** Use standard Markdown formatting for headings, lists, and code blocks. Ensure consistent formatting across all documents.
