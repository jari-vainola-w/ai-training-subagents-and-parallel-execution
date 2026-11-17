import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '..', 'data', 'store.json');

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function monthStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function dateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const now = new Date();
const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

const currentMonth = monthStr(now);
const prevMonth = monthStr(prevMonthDate);

const store = {
  categories: [
    { id: 1, name: 'Food', monthly_limit: 400 },
    { id: 2, name: 'Transport', monthly_limit: 150 },
    { id: 3, name: 'Entertainment', monthly_limit: 100 },
    { id: 4, name: 'Utilities', monthly_limit: 200 },
  ],
  nextCategoryId: 5,
  expenses: [
    // Current month — Food is over budget (460 > 400)
    { id: 1,  description: 'Grocery run',       amount: 95,  date: `${currentMonth}-03`, category_id: 1, created_at: new Date().toISOString() },
    { id: 2,  description: 'Restaurant dinner',  amount: 75,  date: `${currentMonth}-07`, category_id: 1, created_at: new Date().toISOString() },
    { id: 3,  description: 'Coffee shop',        amount: 45,  date: `${currentMonth}-10`, category_id: 1, created_at: new Date().toISOString() },
    { id: 4,  description: 'Weekly shop',        amount: 180, date: `${currentMonth}-14`, category_id: 1, created_at: new Date().toISOString() },
    { id: 5,  description: 'Lunch meeting',      amount: 65,  date: `${currentMonth}-17`, category_id: 1, created_at: new Date().toISOString() },
    { id: 6,  description: 'Bus pass',           amount: 65,  date: `${currentMonth}-01`, category_id: 2, created_at: new Date().toISOString() },
    { id: 7,  description: 'Taxi',               amount: 25,  date: `${currentMonth}-12`, category_id: 2, created_at: new Date().toISOString() },
    { id: 8,  description: 'Internet bill',      amount: 45,  date: `${currentMonth}-05`, category_id: 4, created_at: new Date().toISOString() },
    // Entertainment has no current-month expenses — tests the zero-spend case

    // Previous month — all categories have data
    { id: 9,  description: 'Grocery run',        amount: 110, date: `${prevMonth}-05`, category_id: 1, created_at: new Date().toISOString() },
    { id: 10, description: 'Monthly travel pass',amount: 130, date: `${prevMonth}-01`, category_id: 2, created_at: new Date().toISOString() },
    { id: 11, description: 'Netflix',            amount: 15,  date: `${prevMonth}-08`, category_id: 3, created_at: new Date().toISOString() },
    { id: 12, description: 'Electricity',        amount: 85,  date: `${prevMonth}-10`, category_id: 4, created_at: new Date().toISOString() },
  ],
  nextId: 13,
};

const dataDir = path.dirname(DATA_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));

console.log(`Seeded store with data for ${currentMonth} and ${prevMonth}`);
console.log(`  Food:          460 / 400  (over budget)`);
console.log(`  Transport:      90 / 150  (under budget)`);
console.log(`  Entertainment:   0 / 100  (no expenses this month)`);
console.log(`  Utilities:      45 / 200  (under budget)`);
