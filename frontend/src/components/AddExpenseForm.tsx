import { useState } from 'react';
import { Category } from '../types';

interface Props {
  onAdd: () => void;
  categories: Category[];
}

export function AddExpenseForm({ onAdd, categories }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        amount: parseFloat(amount),
        date,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
      }),
    });

    if (!res.ok) {
      setError('Failed to add expense. Please check all fields.');
      return;
    }

    setDescription('');
    setAmount('');
    setDate('');
    setCategoryId('');
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '0.75rem' }}>Add expense</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label htmlFor="description" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="amount" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Amount (€)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', width: '7rem' }}
          />
        </div>
        <div>
          <label htmlFor="date" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="category" style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ padding: '0.375rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
          Add expense
        </button>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
}
