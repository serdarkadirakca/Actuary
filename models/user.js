const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Employee = require("../models/employee");
const Agecy = require("../models/agency");

const userSchema = new mongoose.Schema({
  employee: {type:mongoose.Schema.ObjectId, ref:'Employee'},
  agency:{type:mongoose.Schema.ObjectId, ref:'Agency'},
  password: String,
  isAdmin: Boolean,
  isManager: Boolean
});

userSchema.pre("save", function(next){
  const user= this;
  bcrypt.hash(user.password, 10, (err,hash)=>{
    user.password=hash;
    next();
  });
});

module.exports = mongoose.model('User', userSchema);