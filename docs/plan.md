# Implementation plan: monthly spending report

## Phase 1 — Foundation (sequential, run in this order)

### Step 1 — Add report types
Files: backend/src/types.ts, frontend/src/types.ts

Add to backend/src/types.ts:
  ReportEntry: { categoryId: number; categoryName: string; monthlyLimit: number; spent: number; remaining: number }
  MonthlySummary: { month: string; entries: ReportEntry[]; totalSpent: number }

Add the same types to frontend/src/types.ts.

Done when: npx tsc --noEmit passes in both backend and frontend.

---

### Step 2 — Report calculation helper
File: backend/src/utils/report.ts (new file)

Export a single function:
  calculateMonthlyReport(month: string): MonthlySummary
  - month is formatted as YYYY-MM
  - Imports expenseStore and categoryStore from the existing store modules
  - Filters expenses for the given month using expense.date.startsWith(month)
  - Returns one ReportEntry per category, with spent and remaining calculated
  - Categories with no expenses in that month return spent: 0

This helper is imported by both the JSON endpoint (Step 3) and the CSV export (Step 4).

Done when: function is exported and npx tsc --noEmit passes.

---

## Phase 2 — Implementation (after Phase 1)

### Step 3 — JSON report endpoint
File: backend/src/routes/reports.ts (new file)

GET /reports/monthly?month=YYYY-MM
- Validate the month parameter: return 400 if missing or not in YYYY-MM format
- Call calculateMonthlyReport from backend/src/utils/report.ts
- Return MonthlySummary as JSON with status 200

Register the route in backend/src/index.ts.

Done when: endpoint returns correct shape and typecheck passes.

---

### Step 4 — CSV export endpoint
File: backend/src/routes/reports.ts

GET /reports/monthly/export?month=YYYY-MM
- Call calculateMonthlyReport from backend/src/utils/report.ts
- Return a CSV string with headers: category,limit,spent,remaining
- Set Content-Type header to text/csv
- Set Content-Disposition to attachment; filename="report-YYYY-MM.csv"

Done when: endpoint returns valid CSV and typecheck passes.

---

### Step 5 — Frontend report view
File: frontend/src/components/ReportView.tsx (new file)

A component that:
- Accepts a month prop (string, YYYY-MM format, defaults to current month)
- Fetches GET /reports/monthly?month={month} on mount
- Shows a table: category name, monthly limit, spent, remaining
- Adds a visual indicator per row: over budget if spent > monthlyLimit, under budget otherwise
- Includes a link: /reports/monthly/export?month={month} with text "Download CSV"

Update frontend/src/App.tsx to render ReportView above the expense list.

Done when: component renders without runtime errors and typecheck passes.

---

### Step 6 — Unit tests for the report utility
File: backend/tests/report.test.ts (new file)

Use the same pattern as the existing category and expense tests: reset both stores in beforeEach,
then seed via categoryStore.create() and expenseStore.create() before calling calculateMonthlyReport().

Write tests covering:
- A month with expenses in two categories: verify spent and remaining are calculated correctly
- A month with no expenses: verify all entries return spent: 0
- A category whose expenses exceed its monthly limit: verify remaining is negative

Done when: npm test passes including the new tests.

---

## Phase 3 — Integration (run after Phase 2)

### Step 7 — Final verification
- Run npx tsc --noEmit in backend and frontend
- Run npm test from backend
- Start the dev server and confirm the report view loads with real data
