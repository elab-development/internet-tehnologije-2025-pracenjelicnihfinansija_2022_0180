import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactions.controller.js';

const router = Router();

router.get('/', requireAuth, getTransactions);
router.get('/:id', requireAuth, getTransactionById);
router.post('/', requireAuth, createTransaction);
router.put('/:id', requireAuth, updateTransaction);
router.delete('/:id', requireAuth, deleteTransaction);

export default router;
