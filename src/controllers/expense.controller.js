
const expenseService = require('../services/expense.service');
const { createExpenseSchema, updateExpenseSchema, filterExpenseSchema } = require('../validators/expense.validator');

const getExpenses = async (req, res, next) => {
  try {
    const { filter, startDate, endDate } = filterExpenseSchema.parse(req.query);

    const expenses = await expenseService.getExpenses(req.user.id, filter, startDate, endDate);

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.issues[0].message });
    }
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const data = createExpenseSchema.parse(req.body);

    const expense = await expenseService.createExpense(req.user.id, data);

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.issues[0].message });
    }
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.id); // URL param siempre llega como string — convertir a número
    const data = updateExpenseSchema.parse(req.body);

    const expense = await expenseService.updateExpense(req.user.id, expenseId, data);

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.issues[0].message });
    }
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expenseId = parseInt(req.params.id);

    await expenseService.deleteExpense(req.user.id, expenseId);

    res.status(200).json({ success: true, data: { message: 'Gasto eliminado exitosamente' } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };