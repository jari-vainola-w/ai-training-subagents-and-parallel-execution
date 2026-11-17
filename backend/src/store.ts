import fs from 'fs';
import path from 'path';
import { Category, Expense } from './types';

interface StoreData {
  expenses: Expense[];
  nextId: number;
  categories: Category[];
  nextCategoryId: number;
}

const DATA_PATH = path.join(__dirname, '..', 'data', 'store.json');

function emptyStore(): StoreData {
  return { expenses: [], nextId: 1, categories: [], nextCategoryId: 1 };
}

function loadFromDisk(): StoreData {
  const dataDir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (fs.existsSync(DATA_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as StoreData;
  }
  return emptyStore();
}

function saveToDisk(data: StoreData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

let state: StoreData =
  process.env.NODE_ENV === 'test' ? emptyStore() : loadFromDisk();

export const expenseStore = {
  getAll(): Expense[] {
    return [...state.expenses].sort(
      (a, b) => b.date.localeCompare(a.date) || b.id - a.id
    );
  },

  findById(id: number): Expense | undefined {
    return state.expenses.find((e) => e.id === id);
  },

  create(data: Omit<Expense, 'id' | 'created_at' | 'category_id'> & { category_id?: number | null }): Expense {
    const expense: Expense = {
      category_id: null,
      ...data,
      id: state.nextId++,
      created_at: new Date().toISOString(),
    };
    state.expenses.push(expense);
    if (process.env.NODE_ENV !== 'test') saveToDisk(state);
    return expense;
  },

  updateCategory(id: number, category_id: number | null): Expense | undefined {
    const expense = state.expenses.find((e) => e.id === id);
    if (!expense) return undefined;
    expense.category_id = category_id;
    if (process.env.NODE_ENV !== 'test') saveToDisk(state);
    return expense;
  },

  delete(id: number): boolean {
    const index = state.expenses.findIndex((e) => e.id === id);
    if (index === -1) return false;
    state.expenses.splice(index, 1);
    if (process.env.NODE_ENV !== 'test') saveToDisk(state);
    return true;
  },

  reset(): void {
    state = emptyStore();
  },
};

export const categoryStore = {
  getAll(): Category[] {
    return [...state.categories];
  },

  findById(id: number): Category | undefined {
    return state.categories.find((c) => c.id === id);
  },

  findByName(name: string): Category | undefined {
    return state.categories.find((c) => c.name === name);
  },

  create(data: { name: string; monthly_limit: number }): Category {
    const category: Category = {
      ...data,
      id: state.nextCategoryId++,
    };
    state.categories.push(category);
    if (process.env.NODE_ENV !== 'test') saveToDisk(state);
    return category;
  },

  delete(id: number): boolean {
    const index = state.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    state.categories.splice(index, 1);
    for (const expense of state.expenses) {
      if (expense.category_id === id) expense.category_id = null;
    }
    if (process.env.NODE_ENV !== 'test') saveToDisk(state);
    return true;
  },
};
