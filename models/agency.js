const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name:String,
  tax:String,
  manager:String,
  managerPassport:String,
  address:String,
  phone:String,
  date:String
});

module.exports = mongoose.model('Agency', agencySchema);