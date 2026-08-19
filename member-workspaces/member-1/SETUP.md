# Member 1 — Setup Instructions

## 1. Required Software

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Git**: `v2.x`

---

## 2. Directory Scope

Your work is scoped exclusively to:
```
CloudStay/frontend/
```

---

## 3. Dependencies & Installation

Open terminal in `CloudStay/frontend` and run:

```bash
cd CloudStay/frontend
npm install
```

Installed core packages:
- `react`, `react-dom`
- `react-router-dom` (routing & guards)
- `axios` (HTTP requests)
- `lucide-react` (UI icons)
- `react-hot-toast` (notifications)
- `vite` (dev server & bundler)

---

## 4. Environment Variables

Create `.env` in `CloudStay/frontend/`:

```env
# Frontend Environment Configuration (Placeholders)
VITE_API_URL=http://localhost:5000/api
```

> **Security Note:** NEVER commit real production URLs or secrets into `.env`.

---

## 5. Execution Commands

### Start Development Server
```bash
npm run dev
```
*App will start locally at:* `http://localhost:5173`

### Run Frontend Production Build
```bash
npm run build
```
*Generates output in:* `frontend/dist/`

### Preview Production Build
```bash
npm run preview
```

---

## 6. Verification Steps

1. Run `npm run dev` and navigate to `http://localhost:5173`.
2. Confirm the **Hostel Listing Page** loads without console errors.
3. Run `npm run build` and ensure Vite outputs a zero-error production bundle in `dist/`.
