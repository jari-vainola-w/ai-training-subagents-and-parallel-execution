import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { useLoopbackServer } from './helpers/loopbackServer';
import { categoryStore, expenseStore } from '../src/store';

const server = useLoopbackServer(app);

beforeEach(() => {
  expenseStore.reset();
});

describe('GET /categories', () => {
  it('returns an empty array when no categories exist', async () => {
    const res = await request(server()).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns category with spent_this_month of 0 when it has no expenses', async () => {
    categoryStore.create({ name: 'Food', monthly_limit: 400 });

    const res = await request(server()).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body[0].spent_this_month).toBe(0);
  });

  it('counts expenses in the current calendar month', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });
    const currentYM = new Date().toISOString().slice(0, 7);
    expenseStore.create({ description: 'Lunch', amount: 12.5, date: `${currentYM}-10`, category_id: category.id });

    const res = await request(server()).get('/categories');
    expect(res.body[0].spent_this_month).toBe(12.5);
  });

  it('does not count expenses from a different month', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });
    expenseStore.create({ description: 'Old lunch', amount: 50, date: '2020-01-15', category_id: category.id });

    const res = await request(server()).get('/categories');
    expect(res.body[0].spent_this_month).toBe(0);
  });

  it('sums multiple expenses in the current month', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });
    const currentYM = new Date().toISOString().slice(0, 7);
    expenseStore.create({ description: 'Lunch', amount: 10, date: `${currentYM}-05`, category_id: category.id });
    expenseStore.create({ description: 'Dinner', amount: 25.5, date: `${currentYM}-06`, category_id: category.id });

    const res = await request(server()).get('/categories');
    expect(res.body[0].spent_this_month).toBe(35.5);
  });

  it('does not count expenses assigned to a different category', async () => {
    const cat1 = categoryStore.create({ name: 'Food', monthly_limit: 400 });
    const cat2 = categoryStore.create({ name: 'Transport', monthly_limit: 250 });
    const currentYM = new Date().toISOString().slice(0, 7);
    expenseStore.create({ description: 'Bus', amount: 30, date: `${currentYM}-05`, category_id: cat2.id });

    const res = await request(server()).get('/categories');
    const food = res.body.find((c: { id: number }) => c.id === cat1.id);
    expect(food.spent_this_month).toBe(0);
  });
});

describe('POST /categories', () => {
  it('creates a category and returns it with status 201', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ name: 'Food', monthly_limit: 400 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Food');
    expect(res.body.monthly_limit).toBe(400);
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ monthly_limit: 400 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when name is an empty string', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ name: '  ', monthly_limit: 400 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when monthly_limit is missing', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ name: 'Food' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when monthly_limit is zero', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ name: 'Food', monthly_limit: 0 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when monthly_limit is negative', async () => {
    const res = await request(server())
      .post('/categories')
      .send({ name: 'Food', monthly_limit: -10 });

    expect(res.status).toBe(400);
  });

  it('persists the created category so it appears in GET /categories', async () => {
    await request(server()).post('/categories').send({ name: 'Food', monthly_limit: 400 });

    const res = await request(server()).get('/categories');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Food');
  });

  it('returns 409 when a category with that name already exists', async () => {
    await request(server()).post('/categories').send({ name: 'Food', monthly_limit: 400 });

    const res = await request(server())
      .post('/categories')
      .send({ name: 'Food', monthly_limit: 200 });

    expect(res.status).toBe(409);
  });
});

describe('DELETE /categories/:id', () => {
  it('deletes an existing category and returns 204', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });

    const res = await request(server()).delete(`/categories/${category.id}`);
    expect(res.status).toBe(204);
  });

  it('removes the category so it no longer appears in GET /categories', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });

    await request(server()).delete(`/categories/${category.id}`);

    const res = await request(server()).get('/categories');
    expect(res.body).toHaveLength(0);
  });

  it('returns 404 when the category does not exist', async () => {
    const res = await request(server()).delete('/categories/99999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for a non-integer id', async () => {
    const res = await request(server()).delete('/categories/abc');
    expect(res.status).toBe(400);
  });

  it('nulls out category_id on expenses that were assigned to the deleted category', async () => {
    const category = categoryStore.create({ name: 'Food', monthly_limit: 400 });
    expenseStore.create({ description: 'Lunch', amount: 10, date: '2024-03-01', category_id: category.id });

    await request(server()).delete(`/categories/${category.id}`);

    const expensesRes = await request(server()).get('/expenses');
    expect(expensesRes.body[0].category_id).toBeNull();
  });
});
