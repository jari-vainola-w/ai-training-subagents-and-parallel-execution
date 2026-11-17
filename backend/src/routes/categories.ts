import { Router, Request, Response } from 'express';
import { categoryStore, expenseStore } from '../store';

export const categoriesRouter = Router();

categoriesRouter.get('/', (_req: Request, res: Response) => {
  const ym = new Date().toISOString().slice(0, 7);
  const expenses = expenseStore.getAll();

  const result = categoryStore.getAll().map((c) => ({
    ...c,
    spent_this_month: expenses
      .filter((e) => e.category_id === c.id && e.date.startsWith(ym))
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  res.json(result);
});

categoriesRouter.post('/', (req: Request, res: Response) => {
  const { name, monthly_limit } = req.body as { name?: unknown; monthly_limit?: unknown };

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'name is required and must be a non-empty string' });
    return;
  }

  if (monthly_limit === undefined || monthly_limit === null || typeof monthly_limit !== 'number' || isNaN(monthly_limit) || monthly_limit <= 0) {
    res.status(400).json({ error: 'monthly_limit is required and must be a positive number' });
    return;
  }

  if (categoryStore.findByName(name.trim())) {
    res.status(409).json({ error: 'A category with that name already exists' });
    return;
  }

  const category = categoryStore.create({ name: name.trim(), monthly_limit });
  res.status(201).json(category);
});

categoriesRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  const deleted = categoryStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.status(204).send();
});
