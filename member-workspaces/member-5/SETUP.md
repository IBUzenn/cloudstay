# Setup Instructions: Member 5

To perform your testing and documentation tasks, you need to set up the project environment. Since your role spans both frontend and backend testing, you'll need to configure both.

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- A Markdown editor (e.g., VS Code) for documentation

## Step 1: Clone the Repository
Ask the project coordinator for access to the repository, or clone it if you already have access.
```bash
git clone <repository-url>
cd CloudStay
```

## Step 2: Backend Setup (for Integration Testing)
You need to install backend dependencies to run the Jest tests.
```bash
cd backend
npm install
```
*Note: You do not necessarily need a running MySQL database for all integration tests if they use mock data or an in-memory database, but consult with Member 2 (Backend) on the testing strategy.*

## Step 3: Frontend Setup (for Component Testing)
You need to install frontend dependencies to run the React Testing Library tests.
```bash
cd ../frontend
npm install
```

## Step 4: Running Tests
**Backend Tests:**
```bash
cd ../backend
npm test
```

**Frontend Tests:**
```bash
cd ../frontend
npm test
```

## Step 5: Documentation Environment
Ensure you have a good Markdown previewer in your editor to visualize the `USER_MANUAL.md` and `TECHNICAL_REPORT.md` as you write them.

If you need to generate diagrams for the technical report, consider using tools like Draw.io or Mermaid.js.
