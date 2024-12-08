const express = require('express');
const auth = require('../middlewares/authMiddleware');  // Authentication middleware
const { addExpense, getExpenses, updateExpense, deleteExpense, getExpenseSummary } = require('../controllers/expenseController');


const router = express.Router();

//console.log(addExpense, getExpenses, updateExpense, deleteExpense, getExpenseSummary)

// 1. Add a new expense
router.post('/', auth, addExpense);

// 2. Get all expenses for the logged-in user
router.get('/', auth, getExpenses);

//3. Update an existing expense
router.put('/:id', auth, updateExpense);

//4. Delete an existing expense
router.delete('/:id', auth, deleteExpense)

//5. Expense Summary
router.get('/summary', auth, getExpenseSummary)

module.exports = router;
