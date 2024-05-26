const mongoose = require("mongoose");

var database = mongoose.connect("mongodb+srv://admin:adminactuary123@mongodb.cxht39c.mongodb.net/Actuary");

module.exports = database;