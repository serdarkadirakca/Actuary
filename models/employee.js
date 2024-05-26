const mongoose = require('mongoose');
const Agency = require("../models/agency");

const employeeSchema = new mongoose.Schema({
  name: String,
  nationality: String,
  passport: String,
  sgk: String,
  birthdate: String,
  email: String,
  phone: String,
  agency:{type:mongoose.Schema.ObjectId, ref:'Agency'},
  job: String,
  salary:Number,
  date:String
});

module.exports = mongoose.model('Employee', employeeSchema);