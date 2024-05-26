const mongoose = require('mongoose');
const Agency = require("./agency");
const Company = require("./company");
const Employee = require("./employee");
const User =  require("./user");
const Insured = require("./insured");
const Policy = require("./policy");


const otherSchema = new mongoose.Schema({
  policy:{type:mongoose.Types.ObjectId, ref:"Policy"},
  invoice:String,
  order:String
});

module.exports = mongoose.model('Policy_Other', otherSchema);