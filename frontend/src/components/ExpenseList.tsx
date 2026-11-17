import { Category, Expense } from '../types';

interface Props {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export function ExpenseList({ expenses, categories, onDelete, onUpdate }: Props) {
  if (expenses.length === 0) {
    return <p style={{ color: '#6b7280' }}>No expenses yet.</p>;
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  async function handleCategoryChange(expenseId: number, value: string) {
    const category_id = value ? parseInt(value, 10) : null;
    const res = await fetch(`http://localhost:3001/expenses/${expenseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id }),
    });
    if (res.ok) onUpdate();
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem 0' }}>Date</th>
            <th style={{ padding: '0.5rem 0' }}>Description</th>
            <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '0.5rem 0' }}>Category</th>
            <th style={{ padding: '0.5rem 0' }}></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>{expense.date}</td>
              <td style={{ padding: '0.5rem 0' }}>{expense.description}</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>€{expense.amount.toFixed(2)}</td>
              <td style={{ padding: '0.5rem 0' }}>
                <select
                  value={expense.category_id ?? ''}
                  onChange={(e) => handleCategoryChange(expense.id, e.target.value)}
                  style={{ padding: '0.2rem 0.375rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                <button
                  onClick={() => onDelete(expense.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
        Total: €{total.toFixed(2)}
      </div>
    </div>
  );
}
