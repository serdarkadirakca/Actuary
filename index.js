const express = require("express");
const bodyParser =  require("body-parser");
const mongoose = require("./config");
const dummyData = require("./data/dummy");
const policyDummyData = require("./data/dummy-policy");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const isAdmin = require("./middlewares/isAdmin.js");
const isManager = require("./middlewares/isManager.js");
const isAuth = require("./middlewares/isAuth.js");
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const port = 3000;

const User =  require("./models/user");
const Agency = require("./models/agency");
const Company = require("./models/company");
const Employee = require("./models/employee");
const Insured = require("./models/insured");

const adminController = require("./controllers/user.js");

app.set("view engine", "ejs");
app.set("views", __dirname +  "/views");
app.use('/static', express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
const store = new MongoDBStore({
    uri: 'mongodb+srv://admin:adminactuary123@mongodb.cxht39c.mongodb.net/Actuary',
    collection: 'sessions'
  });

  app.use(session({
    secret: 'hello',
    cookie: { 
        maxAge:1000*60*60*5
    },
    store:store,
    resave: false,
    saveUninitialized: true,
  }));

app.use(function(req,res,next){
    res.locals.name = req.session.name;
    res.locals.job = req.session.job;
    res.locals.user = req.session.user;
    res.locals.agency = req.session.agency;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isManager = req.session.isManager;
    next();
});

const userRoutes = require('./routes/user.js');

app.use(userRoutes);



dummyData();
// policyDummyData();

app.listen(port,()=>{
    console.log("Listening the port");
});