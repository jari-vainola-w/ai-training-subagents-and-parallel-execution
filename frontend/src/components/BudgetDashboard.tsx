import { useState } from 'react';
import { Category } from '../types';

interface Props {
  categories: Category[];
  onCategoryAdded: () => void;
  onCategoryDeleted: () => void;
}

export function BudgetDashboard({ categories, onCategoryAdded, onCategoryDeleted }: Props) {
  const [name, setName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, monthly_limit: parseFloat(monthlyLimit) }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed to add category.');
      return;
    }

    setName('');
    setMonthlyLimit('');
    onCategoryAdded();
  }

  async function handleDelete(id: number) {
    const res = await fetch(`http://localhost:3001/categories/${id}`, { method: 'DELETE' });
    if (res.ok) onCategoryDeleted();
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '0.75rem' }}>Budget</h2>

      {categories.length === 0 ? (
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No categories yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0' }}>Category</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Limit</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Spent</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Remaining</th>
              <th style={{ padding: '0.5rem 0' }}></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const remaining = c.monthly_limit - c.spent_this_month;
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem 0' }}>{c.name}</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>€{c.monthly_limit.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>€{c.spent_this_month.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right', color: remaining < 0 ? '#ef4444' : 'inherit' }}>
                    €{remaining.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label htmlFor="cat-name" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Category name
          </label>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="cat-limit" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Monthly limit (€)
          </label>
          <input
            id="cat-limit"
            type="number"
            step="0.01"
            min="0.01"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            required
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', width: '7rem' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.375rem 1rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add category
        </button>
      </form>
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}
