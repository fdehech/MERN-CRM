import Transaction from '../models/Transaction.js';
import Client from '../models/Client.js';

// @desc    Get transactions for a client
// @route   GET /api/clients/:clientId/transactions
export const getTransactionsByClientId = async (req, res) => {
  try {
    const transactions = await Transaction.find({ clientId: req.params.clientId })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/clients/:clientId/transactions
export const createTransaction = async (req, res) => {
  try {
    const { amount, description, date } = req.body;
    
    // Verify client exists
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const transaction = new Transaction({
      clientId: req.params.clientId,
      amount,
      description,
      date: date || new Date(),
    });
    
    const savedTransaction = await transaction.save();
    
    // Update client's last activity
    client.lastActivity = new Date();
    await client.save();
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
