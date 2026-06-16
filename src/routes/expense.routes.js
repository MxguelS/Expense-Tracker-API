
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expense.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
