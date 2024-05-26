const mongoose = require('mongoose');
const Agency = require("../models/agency");

const expenseSchema = new mongoose.Schema({
  agency:{type:mongoose.Types.ObjectId,ref:"Agency"},
  month:String,
  bill:Number,
  rent:Number,
  supply:Number,
  salary:Number,
  salaryTax:Number,
  date:String
});

module.exports = mongoose.model('Expense', expenseSchema);