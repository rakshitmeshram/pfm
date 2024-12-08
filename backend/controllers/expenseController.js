const Expense = require('../models/Expense');

// Get all expenses for a specific user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({date: -1});
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new expense for a specific user
const addExpense = async (req, res) => {
  const { category, amount, description } = req.body;

  try {
    const newExpense = new Expense({
      userId: req.params.userId,
      category,
      amount,
      description,
    });

    await newExpense.save();
    res.status(201).json({message: 'Expense added successfully', newExpense});
  } catch (err) {
    res.status(500).json({ message: 'Error saving expense' });
  }
};


// Update an  existing expense for a specific user
const updateExpense = async (req, res) => {
  const { category, amount, description } = req.body;

  try {
    const newExpense = await Expense.findByIdAndUpdate({
      userId: req.params.userId,
      category,
      amount,
      description,
    });

    if(!newExpense) {
      return res.status(404).json({message: 'Expense not found'});
    }
    res.status(200).json({message: 'Expense updated successfully', newExpense});
  } catch (err) {
    res.status(500).json({ message: 'Error saving expense' });
  }
};

const deleteExpense = async(req, res) => {
  try{
    const expense = await Expense.findByIdAndDelete({
      userId: req.params.userId
    })
    if(!expense) {
      return res.status(404).json({message: 'Expense not found'})
    }
    res.status(200).json({message: 'Expense deleted successfully'})
  } catch(err) {
    res.status(500).json({message: 'Server Error'})
  }
}

const getExpenseSummary = async(req, res) => {
  try {
    const {startDate, endDate} = req.query;

    const match = {userId: req.params.userId};
    if (startDate && endDate) {
      match.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
    }

    const summary = await Expense.aggregate([
      {$match: match},
      {
        $group: {
          _id: '$category',
          totalAmount: {$sum: '$amount'},
        }
      }
    ]);
    res.status(200).json(summary);
  } catch(err) {
    res.status(500).json({message: 'Server Error'});
  }
};


module.exports = {
  addExpense, 
  getExpenses, 
  updateExpense, 
  deleteExpense, 
  getExpenseSummary
};