import { Router, Request, Response } from 'express';
import { categoryStore, expenseStore } from '../store';
import { Expense } from '../types';

export const expensesRouter = Router();

expensesRouter.get('/', (_req: Request, res: Response) => {
  res.json(expenseStore.getAll());
});

expensesRouter.post('/', (req: Request, res: Response) => {
  const { description, amount, date, category_id } = req.body as Partial<Expense> & { category_id?: number | null };

  if (!description || amount === undefined || amount === null || !date) {
    res.status(400).json({ error: 'description, amount, and date are required' });
    return;
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    res.status(400).json({ error: 'amount must be a number' });
    return;
  }

  if (category_id !== undefined && category_id !== null) {
    if (!categoryStore.findById(category_id)) {
      res.status(400).json({ error: 'category not found' });
      return;
    }
  }

  const expense = expenseStore.create({ description, amount, date, category_id: category_id ?? null });
  res.status(201).json(expense);
});

expensesRouter.patch('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const { category_id } = req.body as { category_id?: unknown };

  if (category_id !== null && category_id !== undefined) {
    if (typeof category_id !== 'number' || isNaN(category_id)) {
      res.status(400).json({ error: 'category_id must be a number or null' });
      return;
    }
    if (!categoryStore.findById(category_id)) {
      res.status(400).json({ error: 'category not found' });
      return;
    }
  }

  const updated = expenseStore.updateCategory(id, category_id === undefined ? null : (category_id as number | null));
  if (!updated) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  res.json(updated);
});

expensesRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = expenseStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Expense not found' });
    return;
  }

  res.status(204).send();
});
