const mongoose = require('mongoose');

const insuredSchema = new mongoose.Schema({
  agency:{type:mongoose.Types.ObjectId,ref:"Agency"},
  user:{type:mongoose.Types.ObjectId,ref:"User"},
  name: String,
  nationality: String,
  passport: String,
  birthdate: String,
  email: String,
  phone: String,
  date:String
});

module.exports = mongoose.model('Insured', insuredSchema);