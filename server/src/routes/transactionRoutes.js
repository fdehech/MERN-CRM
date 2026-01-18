import express from 'express';
import {
  getTransactionsByClientId,
  createTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

// Client-specific routes
router.route('/clients/:clientId/transactions')
  .get(getTransactionsByClientId)
  .post(createTransaction);

// Transaction-specific routes
router.route('/transactions/:id')
  .delete(deleteTransaction);

export default router;
