# CloudStay — Test Results Report

## Summary of Execution

- **Date**: 2026-08-14
- **Backend Automated Test Suites**: **8 / 8 Passed** (33 / 33 tests passed)
- **Frontend Production Build**: **Passed** (`npm run build` compiled 1595 modules successfully)
- **AWS Deployment Validation**: Pending live AWS deployment verification
- **Acceptance Testing**: Pending manual user execution

---

## Code Coverage Results (Backend)

| Module | Statements (%) | Branches (%) | Functions (%) | Lines (%) |
|---|---|---|---|---|
| **All Files** | **50.41%** | **37.12%** | **55.07%** | **54.73%** |
| `src/middleware` | 84.21% | 64.28% | 100% | 83.92% |
| `src/routes` | 61.66% | 100% | 100% | 61.66% |
| `src/services` | 50.62% | 27.86% | 52.17% | 61.78% |
| `src/utils` | 95.00% | 80.00% | 80.00% | 100% |
| `src/validators` | 90.47% | 50.00% | 100% | 95.00% |

---

## Executed Automated Test Suites

1. `tests/integration/auth.api.test.js` — **PASS**
2. `tests/integration/booking.api.test.js` — **PASS**
3. `tests/integration/hostel.api.test.js` — **PASS**
4. `tests/integration/upload.api.test.js` — **PASS**
5. `tests/integration/security.test.js` — **PASS**
6. `tests/unit/auth.service.test.js` — **PASS**
7. `tests/unit/booking.service.test.js` — **PASS**
8. `tests/unit/hostel.service.test.js` — **PASS**
