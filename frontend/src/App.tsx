import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ExpenseList } from './components/ExpenseList';
import { AddExpenseForm } from './components/AddExpenseForm';
import { BudgetDashboard } from './components/BudgetDashboard';
import { Category, Expense } from './types';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchExpenses() {
    const res = await fetch('http://localhost:3001/expenses');
    if (res.ok) setExpenses(await res.json());
  }

  async function fetchCategories() {
    const res = await fetch('http://localhost:3001/categories');
    if (res.ok) setCategories(await res.json());
  }

  async function deleteExpense(id: number) {
    await fetch(`http://localhost:3001/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
  }

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  function handleExpenseMutation() {
    fetchExpenses();
    fetchCategories();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <Header />
      <BudgetDashboard
        categories={categories}
        onCategoryAdded={fetchCategories}
        onCategoryDeleted={handleExpenseMutation}
      />
      <AddExpenseForm onAdd={handleExpenseMutation} categories={categories} />
      <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Expenses</h2>
      <ExpenseList expenses={expenses} onDelete={deleteExpense} categories={categories} onUpdate={handleExpenseMutation} />
    </div>
  );
}
