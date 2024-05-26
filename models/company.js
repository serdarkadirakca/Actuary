const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  tax: String,
  manager: String,
  address: String,
  phone: String,
  commission:Number,
  date:String
});

module.exports = mongoose.model('Company', companySchema);