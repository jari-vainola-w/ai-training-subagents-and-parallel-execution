import express from 'express';
import cors from 'cors';
import { expensesRouter } from './routes/expenses';
import { categoriesRouter } from './routes/categories';

export const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/expenses', expensesRouter);
app.use('/categories', categoriesRouter);

if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}
