export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  created_at: string;
  category_id: number | null;
}

export interface Category {
  id: number;
  name: string;
  monthly_limit: number;
}
