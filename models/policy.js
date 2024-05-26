const mongoose = require('mongoose');
const Agency = require("./agency");
const Company = require("./company");
const Employee = require("./employee");
const User =  require("./user");
const Insured = require("./insured");

const policySchema = new mongoose.Schema({
  company:{type:mongoose.Types.ObjectId, ref:"Company"},
  agency:{type:mongoose.Types.ObjectId, ref:"Agency"},
  user:{type:mongoose.Types.ObjectId, ref:"User"},
  insured:{type:mongoose.Types.ObjectId, ref:"Insured"},
  totalPrice:Number,
  commission:Number,
  companyShare:Number,
  date:String
});

module.exports = mongoose.model('Policy', policySchema);