## Project
Expense tracker — React (Vite) frontend, Express backend, JSON file store.

## Running locally
npm run dev — starts frontend (port 5173) and backend (port 3001) concurrently.

## Architecture
Frontend: components in frontend/src/components/. No routing library, no global state. Use React hooks and prop drilling.
Backend: route handlers in backend/src/routes/. Data layer in backend/src/store.ts (expenseStore and categoryStore). No database or ORM.

## Code style
TypeScript strict mode. No `any`. Use types from the relevant types.ts before creating new types.

## Testing
Backend unit tests: Vitest in backend/tests/. Run: npm test (from backend/).
E2E tests: Playwright in frontend/e2e/. Run: npm run test:e2e (from frontend/).

## Reports
Report calculation logic lives in backend/src/utils/report.ts.
Route handlers in backend/src/routes/reports.ts import from utils.
They do not contain calculation logic themselves.

## Prohibited
Do not change the existing expense or category fields. Add new types or files instead.
Do not add dependencies without checking whether an existing package already covers the need.
