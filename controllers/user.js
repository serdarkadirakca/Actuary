const bcrypt =  require("bcrypt");
const User =  require("../models/user");
const Agency = require("../models/agency");
const Company = require("../models/company");
const Employee = require("../models/employee");
const Insured = require("../models/insured");
const Policy = require("../models/policy");
const Expense = require("../models/expense");
const Policy_Casco = require("../models/policy-casco");
const Policy_Traffic = require("../models/policy-traffic");
const Policy_Dask = require("../models/policy-dask");
const Policy_Property = require("../models/policy-property");
const Policy_Health = require("../models/policy-health");
const Policy_Other = require("../models/policy-other");
const Date = require("../middlewares/date");

exports.getIndex = async (req,res)=>{
    try{
        res.render("users/index",{
            title: "Login",
            message: "",
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postIndex = async (req,res)=>{
    try{
        var email = req.body.email;
        var password =  req.body.password;
        var emp = await Employee.findOne({email:email});
        if(!emp){
            res.render("users/index",{
                title:"Login",
                message:"Wrong Email!"
            });
        }
        else{
            var user = await User.findOne({employee:emp._id}).populate("employee");
            var hashedPassword = await bcrypt.compare(password, user.password);
            if(hashedPassword){
                req.session.name=user.employee.name;
                req.session.job=user.employee.job;
                req.session.user=user._id;
                req.session.agency=user.employee.agency;
                req.session.isAdmin=user.isAdmin;
                req.session.isManager=user.isManager;
                res.redirect("/dashboard");
            }
            else{
                res.render("users/index",{
                    title:"Login",
                    message:"Wrong Password!"
                });
            }
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getDashboard = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var month = Date.split("-")[0].split(".")[1];
            var policyList = await Policy.find().populate("company").populate("agency");
            var expenseList = await Expense.find();
            var insuredList = await Insured.find();
            var cascoList = await Policy_Casco.find().populate("policy");
            var trafficList = await Policy_Traffic.find().populate("policy");
            var daskList = await Policy_Dask.find().populate("policy");
            var propertyList = await Policy_Property.find().populate("policy");
            var healthList = await Policy_Health.find().populate("policy");
            var otherList = await Policy_Other.find().populate("policy");
            var company = await Company.find().distinct("name");
            var agency = await Agency.find().distinct("name");
            var income=0,expense=0,policy=policyList.length,insured=insuredList.length;
            var policyTypes =  ["Casco Insurance","Traffic Insurance","DASK Insurance","Property Insurance","Health Insurance","Other Insurance"]
            var countPolicy=[cascoList.length,trafficList.length,daskList.length,propertyList.length,healthList.length,otherList.length];
            var countCompany=[],countAgency=[];
            var incomePolicy=[0,0,0,0,0,0],incomeCompany=[],incomeAgency=[];
            for(i=0;i<policyList.length;i++){
                    income+=policyList[i].commission;
                    income=Math.round(income);
            }
            for(i=0;i<expenseList.length;i++){
                expense=expense+expenseList[i].bill+expenseList[i].rent+expenseList[i].supply+expenseList[i].salary+expenseList[i].salaryTax;
                expense=Math.round(expense);
            }
            for(i=0;i<cascoList.length;i++){
                incomePolicy[0]+=cascoList[i].policy.commission;
                incomePolicy[0]=Math.round(incomePolicy[0]);
            }
            for(i=0;i<trafficList.length;i++){
                incomePolicy[1]+=trafficList[i].policy.commission;
                incomePolicy[1]=Math.round(incomePolicy[1]);
            }
            for(i=0;i<daskList.length;i++){
                incomePolicy[2]+=daskList[i].policy.commission;
                incomePolicy[2]=Math.round(incomePolicy[2]);
            }
            for(i=0;i<propertyList.length;i++){
                incomePolicy[3]+=propertyList[i].policy.commission;
                incomePolicy[3]=Math.round(incomePolicy[3]);
            }
            for(i=0;i<healthList.length;i++){
                incomePolicy[4]+=healthList[i].policy.commission;
                incomePolicy[4]=Math.round(incomePolicy[4]);
            }
            for(i=0;i<otherList.length;i++){
                incomePolicy[5]+=otherList[i].policy.commission;
                incomePolicy[5]=Math.round(incomePolicy[5]);
            }
            for(i=0;i<policyList.length;i++){
                for(j=0;j<company.length;j++){
                    countCompany.push(0);
                    incomeCompany.push(0);
                    if(policyList[i].company.name==company[j]){
                        countCompany[j]++;
                        incomeCompany[j]+=policyList[i].commission;
                        incomeCompany[j]=Math.round(incomeCompany[j]);
                    }
                }
            } 
            for(i=0;i<policyList.length;i++){
                for(j=0;j<agency.length;j++){
                    countAgency.push(0);
                    incomeAgency.push(0);
                    if(policyList[i].agency.name==agency[j]){
                        countAgency[j]++;
                        incomeAgency[j]+=policyList[i].commission;
                        incomeAgency[j]=Math.round(incomeAgency[j]);
                    }
                }
            }
            
            var incomeList = await Policy.find();
            var expenseList = await Expense.find();
            var month = [{no:"01",name:"January",income:0,expense:0},{no:"02",name:"February",income:0,expense:0},
            {no:"03",name:"March",income:0,expense:0},{no:"04",name:"April",income:0,expense:0},{no:"05",name:"May",income:0,expense:0},
            {no:"06",name:"June",income:0,expense:0},{no:"07",name:"July",income:0,expense:0},{no:"08",name:"August",income:0,expense:0},
            {no:"09",name:"September",income:0,expense:0},{no:"10",name:"October",income:0,expense:0},{no:"11",name:"November",income:0,expense:0},
            {no:"12",name:"December",income:0,expense:0},]
            for(i=0;i<incomeList.length;i++){
                for(j=0;j<month.length;j++){
                    if(month[j].no == incomeList[i].date.split(".")[1]){
                        month[j].income+=incomeList[i].commission;
                        month[j].income=Math.round(month[j].income);
                    }
                }
            }
            for(i=0;i<expenseList.length;i++){
                for(j=0;j<month.length;j++){
                    if(month[j].no == expenseList[i].month){
                        month[j].expense=month[j].expense + expenseList[i].bill + expenseList[i].rent + 
                        expenseList[i].supply + expenseList[i].salary + expenseList[i].salaryTax;
                        month[j].expense=Math.round(month[j].expense);
                    }
                }
            }
            res.render("users/dashboard",{
                title:"Dashboard",
                income:income,
                expense:expense,
                policy:policy,
                insured:insured,
                company:company,
                agency:agency,
                policyTypes:policyTypes,
                countPolicy:countPolicy,
                incomePolicy:incomePolicy,
                countCompany:countCompany,
                incomeCompany:incomeCompany,
                countAgency:countAgency,
                incomeAgency:incomeAgency,
                month:month
            });
        }
        else if(!isAdmin && isManager){
            var agencyId = req.session.agency;
            var policyList = await Policy.find({agency:agencyId}).populate("company").populate({
                path:"user",
                model:"User",
                populate:{
                    path:"employee",
                    model:"Employee"
                }
            });
            var expenseList = await Expense.find({agency:agencyId});
            var insuredList = await Insured.find({agency:agencyId});
            var cascoList = await Policy_Casco.find({policy:policyList}).populate("policy");
            var trafficList = await Policy_Traffic.find({policy:policyList}).populate("policy");
            var daskList = await Policy_Dask.find({policy:policyList}).populate("policy");
            var propertyList = await Policy_Property.find({policy:policyList}).populate("policy");
            var healthList = await Policy_Health.find({policy:policyList}).populate("policy");
            var otherList = await Policy_Other.find({policy:policyList}).populate("policy");
            var company = await Company.find().distinct("name");
            var agency = await Agency.find().distinct("name");
            var employee = await Employee.find({agency:agencyId});
            var employeeList = await Employee.find({agency:agencyId}).where("job").ne("Agency Manager");
            var income=0,expense=0,policy=policyList.length,insured=insuredList.length;
            var policyTypes =  ["Casco Insurance","Traffic Insurance","DASK Insurance","Property Insurance","Health Insurance","Other Insurance"]
            var countPolicy=[cascoList.length,trafficList.length,daskList.length,propertyList.length,healthList.length,otherList.length];
            var countCompany=[],countAgency=[],countEmployee=[];
            var incomePolicy=[0,0,0,0,0,0],incomeCompany=[],incomeAgency=[],incomeEmployee=[];
            for(i=0;i<policyList.length;i++){
                    income+=policyList[i].commission;
                    income=Math.round(income);
            }
            for(i=0;i<expenseList.length;i++){
                    expense=expense+expenseList[i].bill+expenseList[i].rent+expenseList[i].supply+expenseList[i].salary+expenseList[i].salaryTax;
                    expense=Math.round(expense);
            }
            for(i=0;i<cascoList.length;i++){
                    incomePolicy[0]+=cascoList[i].policy.commission;
                    incomePolicy[0]=Math.round(incomePolicy[0]);
            }
            for(i=0;i<trafficList.length;i++){
                    incomePolicy[1]+=trafficList[i].policy.commission;
                    incomePolicy[1]=Math.round(incomePolicy[1]);
            }
            for(i=0;i<daskList.length;i++){
                    incomePolicy[2]+=daskList[i].policy.commission;
                    incomePolicy[2]=Math.round(incomePolicy[2]);
            }
            for(i=0;i<propertyList.length;i++){
                    incomePolicy[3]+=propertyList[i].policy.commission;
                    incomePolicy[3]=Math.round(incomePolicy[3]);
            }
            for(i=0;i<healthList.length;i++){
                    incomePolicy[4]+=healthList[i].policy.commission;
                    incomePolicy[4]=Math.round(incomePolicy[4]);
            }
            for(i=0;i<otherList.length;i++){
                    incomePolicy[5]+=otherList[i].policy.commission;
                    incomePolicy[5]=Math.round(incomePolicy[5]);
            }
            for(i=0;i<policyList.length;i++){
                for(j=0;j<company.length;j++){
                    countCompany.push(0);
                    incomeCompany.push(0);
                        if(policyList[i].company.name==company[j]){
                            countCompany[j]++;
                            incomeCompany[j]+=policyList[i].commission;
                            incomeCompany[j]=Math.round(incomeCompany[j]);
                    }   
                } 
            }
            
            for(j=0;j<employee.length;j++){
                countEmployee.push(0);
                incomeEmployee.push(0);
                for(i=0;i<policyList.length;i++){
                    if(policyList[i].user.employee.name==employee[j].name){
                        countEmployee[j]++;
                        incomeEmployee[j]+=policyList[i].commission;
                        incomeEmployee[j]=Math.round(incomeEmployee[j]);
                    }
                }
            }
            res.render("users/dashboard-manager",{
                title:"Dashboard",
                income:income,
                expense:expense,
                policy:policy,
                insured:insured,
                company:company,
                agency:agency,
                employee:employee,
                employeeList:employeeList,
                policyTypes:policyTypes,
                countPolicy:countPolicy,
                incomePolicy:incomePolicy,
                countCompany:countCompany,
                incomeCompany:incomeCompany,
                countAgency:countAgency,
                incomeAgency:incomeAgency,
                countEmployee:countEmployee,
                incomeEmployee:incomeEmployee
            });
        }
        else{
            var user = req.session.user;
            var policyList = await Policy.find({user:user}).populate("company").populate("agency").populate("insured");
            var expenseList = await Expense.find();
            var insuredList = await Insured.find();
            var cascoList = await Policy_Casco.find({policy:policyList}).populate("policy");
            var trafficList = await Policy_Traffic.find({policy:policyList}).populate("policy");
            var daskList = await Policy_Dask.find({policy:policyList}).populate("policy");
            var propertyList = await Policy_Property.find({policy:policyList}).populate("policy");
            var healthList = await Policy_Health.find({policy:policyList}).populate("policy");
            var otherList = await Policy_Other.find({policy:policyList}).populate("policy");
            var company = await Company.find().distinct("name");
            var agency = await Agency.find().distinct("name");
            var income=0,expense=0,policy=policyList.length,insured=insuredList.length;
            var policyTypes =  ["Casco Insurance","Traffic Insurance","DASK Insurance","Property Insurance","Health Insurance","Other Insurance"]
            var countPolicy=[cascoList.length,trafficList.length,daskList.length,propertyList.length,healthList.length,otherList.length];
            var countCompany=[],countAgency=[]
            var incomePolicy=[0,0,0,0,0,0],incomeCompany=[];
            var sharePolicy=[0,0,0,0,0,0],shareCompany=[];
            var pricePolicy=[0,0,0,0,0,0],priceCompany=[];
            for(i=0;i<cascoList.length;i++){
                sharePolicy[0]+=cascoList[i].policy.companyShare;
                incomePolicy[0]+=cascoList[i].policy.commission;
                pricePolicy[0]+=cascoList[i].policy.totalPrice;
                sharePolicy[0]=Math.round(sharePolicy[0]);
                incomePolicy[0]=Math.round(incomePolicy[0]);
                pricePolicy[0]=Math.round(pricePolicy[0]);
            }
            for(i=0;i<trafficList.length;i++){
                sharePolicy[1]+=trafficList[i].policy.companyShare;
                incomePolicy[1]+=trafficList[i].policy.commission;
                pricePolicy[1]+=trafficList[i].policy.totalPrice;
                sharePolicy[1]=Math.round(sharePolicy[1]);
                incomePolicy[1]=Math.round(incomePolicy[1]);
                pricePolicy[1]=Math.round(pricePolicy[1]);
            }
            for(i=0;i<daskList.length;i++){
                sharePolicy[2]+=daskList[i].policy.companyShare;
                incomePolicy[2]+=daskList[i].policy.commission;
                pricePolicy[2]+=daskList[i].policy.totalPrice;
                sharePolicy[2]=Math.round(sharePolicy[2]);
                incomePolicy[2]=Math.round(incomePolicy[2]);
                pricePolicy[2]=Math.round(pricePolicy[2]);
            }
            for(i=0;i<propertyList.length;i++){
                sharePolicy[3]+=propertyList[i].policy.companyShare;
                incomePolicy[3]+=propertyList[i].policy.commission;
                pricePolicy[3]+=propertyList[i].policy.totalPrice;
                sharePolicy[3]=Math.round(sharePolicy[3]);
                incomePolicy[3]=Math.round(incomePolicy[3]);
                pricePolicy[3]=Math.round(pricePolicy[3]);
            }
            for(i=0;i<healthList.length;i++){
                sharePolicy[4]+=healthList[i].policy.companyShare;
                incomePolicy[4]+=healthList[i].policy.commission;
                pricePolicy[4]+=healthList[i].policy.totalPrice;
                sharePolicy[4]=Math.round(sharePolicy[4]);
                incomePolicy[4]=Math.round(incomePolicy[4]);
                pricePolicy[4]=Math.round(pricePolicy[4]);
            }
            for(i=0;i<otherList.length;i++){
                sharePolicy[5]+=otherList[i].policy.companyShare;
                incomePolicy[5]+=otherList[i].policy.commission;
                pricePolicy[5]+=otherList[i].policy.totalPrice;
                sharePolicy[5]=Math.round(sharePolicy[5]);
                incomePolicy[5]=Math.round(incomePolicy[5]);
                pricePolicy[5]=Math.round(pricePolicy[5]);
            }
            for(i=0;i<policyList.length;i++){
                for(j=0;j<company.length;j++){
                    countCompany.push(0);
                    shareCompany.push(0);
                    incomeCompany.push(0);
                    priceCompany.push(0);
                    if(policyList[i].company.name==company[j]){
                        countCompany[j]++;
                        shareCompany[j]+=policyList[i].companyShare;
                        incomeCompany[j]+=policyList[i].commission;
                        priceCompany[j]+=policyList[i].totalPrice;
                        shareCompany[j]=Math.round(shareCompany[j]);
                        incomeCompany[j]=Math.round(incomeCompany[j]);
                        priceCompany[j]=Math.round(priceCompany[j]);
                    }
                }
            }
            res.render("users/dashboard-insurer",{
                title:"Dashboard",
                policy:policy,
                insured:insured,
                company:company,
                agency:agency,
                employee:employee,
                policyTypes:policyTypes,
                countPolicy:countPolicy,
                sharePolicy:sharePolicy,
                incomePolicy:incomePolicy,
                pricePolicy:pricePolicy,
                countCompany:countCompany,
                shareCompany:shareCompany,
                incomeCompany:incomeCompany,
                priceCompany:priceCompany
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterAgency = async (req,res)=>{
    try{
        res.render("users/register-agency",{
            title:  "Register Agency"
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterAgency = async (req,res)=>{
    try{
        var name = req.body.name;
        var tax = req.body.tax;
        var manager = req.body.manager;
        var managerPassport = req.body.managerPassport;
        var address = req.body.address;
        var phone = req.body.phone;
        Agency.create({name:name,tax:tax,manager:manager,managerPassport:managerPassport,address:address,phone:phone,date:Date});
        res.redirect("/agency");
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterCompany = async (req,res)=>{
    try{
        res.render("users/register-company",{
            title:  "Register Company"
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterCompany = async (req,res)=>{
    try{
        var name = req.body.name;
        var tax = req.body.tax;
        var manager = req.body.manager;
        var address = req.body.address;
        var phone = req.body.phone;
        var commission = req.body.commission;
        Company.create({name:name,tax:tax,manager:manager,address:address,phone:phone,commission:commission});
        res.redirect("/company");
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterEmployee = async (req,res)=>{
    try{
        var agencyList = await Agency.find();
        res.render("users/register-employee",{
            title:  "Register Employee",
            message:"",
            agencyList:agencyList
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterEmployee = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var agency;
        if(isAdmin && isManager){
            agency = req.body.agency;
        }
        else{
            agency = req.session.agency;
        }
        var name = req.body.name;
        var nationality = req.body.nationality;
        var passport = req.body.passport;
        var sgk = req.body.sgk;
        var birthdate = req.body.birthdate;
        var email = req.body.email;
        var phone = req.body.phone;
        var job = req.body.job;
        var salary = req.body.salary;
        if(agency==0 || job==0){
            var agencyList = await Agency.find();
            res.render("users/register-employee",{
                title:  "Register Employee",
                agencyList:agencyList,
                message:"You need to select agency and job!"
        });
        }
        else{
        Employee.create({name:name,nationality:nationality,passport:passport,sgk:sgk,birthdate:birthdate,email:email,
            phone:phone,agency:agency,job:job,salary:salary});
        res.redirect("/employee");
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterInsured = async (req,res)=>{
    try{
        res.render("users/register-insured",{
            title:  "Register Insured"
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterInsured = async (req,res)=>{
    try{
        var user = req.session.user;
        var agency = req.session.agency;
        var name = req.body.name;
        var nationality = req.body.nationality;
        var passport = req.body.passport;
        var birthdate = req.body.birthdate;
        var email = req.body.email;
        var phone = req.body.phone;
        Insured.create({user:user,agency:agency,name:name,nationality:nationality,passport:passport,birthdate:birthdate,email:email,phone:phone});
        res.redirect("/insured");
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterExpense = async (req,res)=>{
    try{
        var month = [{no:"01",name:"January"},{no:"02",name:"February"},{no:"03",name:"March"},{no:"04",name:"April"},{no:"05",name:"May",},
            {no:"06",name:"June"},{no:"07",name:"July"},{no:"08",name:"August"},{no:"09",name:"September"},{no:"10",name:"October"},
            {no:"11",name:"November"},{no:"12",name:"December"},]
        var agency = await Agency.find();
        res.render("users/register-expense",{
            title:  "Register Expense",
            message: "",
            month:month,
            agency:agency
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterExpense = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.body.agency;
            var month = req.body.month;
            var bill = req.body.bill;
            var rent = req.body.rent;
            var supply = req.body.supply;
            var salary = req.body.salary;
            var salaryTax = salary*0.10;
            Expense.create({agency:agency,month:month,bill:bill,rent:rent,supply:supply,salary:salary,salaryTax:salaryTax,date:Date});
            res.redirect("/report-expense");
        }
        else{
            var month = req.body.month;
            var bill = req.body.bill;
            var rent = req.body.rent;
            var supply = req.body.supply;
            var salary = req.body.salary;
            var salaryTax = salary*0.10;
            Expense.create({agency:req.session.agency,month:month,bill:bill,rent:rent,supply:supply,salary:salary,salaryTax:salaryTax,date:Date});
            var month = [{no:"01",name:"January"},{no:"02",name:"February"},{no:"03",name:"March"},{no:"04",name:"April"},{no:"05",name:"May",},
            {no:"06",name:"June"},{no:"07",name:"July"},{no:"08",name:"August"},{no:"09",name:"September"},{no:"10",name:"October"},
            {no:"11",name:"November"},{no:"12",name:"December"},]
            var agency = await Agency.find();
            res.render("users/register-expense",{
                title:  "Register Expense",
                message:"You have registered expenses",
                month:month,
                agency:agency
                
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterCasco = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-casco",{
                title:  "Register Casco",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-casco",{
                title:  "Register Casco",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-casco",{
                title:  "Register Casco",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterCasco = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var plate = req.body.plate;
        var chassis = req.body.chassis;
        var price = req.body.price;
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
            var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
            await Policy_Casco.create({policy:policy._id,plate:plate,chassis:chassis});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
            var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
            await Policy_Casco.create({policy:policy._id,plate:plate,chassis:chassis});
        }
        
        res.redirect("/policy-casco");
        
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterTraffic = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-traffic",{
                title:  "Register Traffic",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-traffic",{
                title:  "Register Traffic",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-traffic",{
                title:  "Register Traffic",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterTraffic = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var plate = req.body.plate;
        var chassis = req.body.chassis;
        var price = req.body.price;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-traffic");
                var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Traffic.create({policy:policy._id,plate:plate,chassis:chassis});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-traffic");
                var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Traffic.create({policy:policy._id,plate:plate,chassis:chassis});
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterDask = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-dask",{
                title:  "Register DASK",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-dask",{
                title:  "Register DASK",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-dask",{
                title:  "Register DASK",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterDask = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var deed = req.body.deed;
        var address = req.body.address;
        var price = req.body.price;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-dask");
                var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Dask.create({policy:policy._id,deed:deed,address:address});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-dask");
                var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Dask.create({policy:policy._id,deed:deed,address:address});
        }
        
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterProperty = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-property",{
                title:  "Register Property",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-property",{
                title:  "Register Property",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-property",{
                title:  "Register Property",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterProperty = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var deed = req.body.deed;
        var address = req.body.address;
        var price = req.body.price;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-property");
                var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Property.create({policy:policy._id,deed:deed,address:address});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-health");
                var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Health.create({policy:policy._id,sgk:sgk});
        }
        
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterHealth = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-health",{
                title:  "Register Health",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-health",{
                title:  "Register Health",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-health",{
                title:  "Register Health",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterHealth = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var sgk = req.body.sgk;
        var price = req.body.price;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-health");
                var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Health.create({policy:policy._id,sgk:sgk});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-health");
                var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Health.create({policy:policy._id,sgk:sgk});
        }
        
    }
    catch{
        console.log("Error!");
    }
},
exports.getRegisterOther = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            var userList = await User.find().populate("employee").sort("name");
            res.render("users/register-other",{
                title:  "Register Other",
                insuredList:insuredList,
                companyList:companyList,
                userList:userList
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-other",{
                title:  "Register Other",
                insuredList:insuredList,
                companyList:companyList
            });
        }
        else{
            var user = req.session.user;
            var insuredList = await Insured.find().sort("name");
            var companyList = await Company.find().sort("name");
            res.render("users/register-other",{
                title:  "Register Other",
                insuredList:insuredList,
                companyList:companyList
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postRegisterOther= async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        var insured = req.body.insured;
        var company = req.body.company;
        var invoice = req.body.invoice;
        var order = req.body.order;
        var price = req.body.price;
        var user = req.body.user;
        var userList = await User.findOne({_id:user}).populate({
            path:"employee",
            model:"Employee",
            populate:{
                path:"agency",
                model:"Agency"
            }
        });
        var companyInfo = await Company.find({_id:company});
        var rate =  companyInfo[0].commission;
        var commission = price*rate/100;
        var companyShare = (price-commission);
        if(isAdmin && isManager){
            await Policy.create({company:company,agency:userList.employee.agency,user:user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-other");
                var policy = await Policy.findOne({company:company,agency:userList.employee.agency,user:user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Other.create({policy:policy._id,invoice:invoice,order:order});
        }
        else{
            await Policy.create({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,date:Date,totalPrice:price,
                commission:commission,companyShare:companyShare});
                res.redirect("/policy-other");
                var policy = await Policy.findOne({company:company,agency:res.locals.agency,user:res.locals.user,insured:insured,totalPrice:price,
                commission:commission,companyShare:companyShare});
                await Policy_Other.create({policy:policy._id,invoice:invoice,order:order});
        }
        
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditAgency = async (req,res)=>{
    try{
        var id = req.params.id;
        var agency = await Agency.findOne({_id:id}).sort("name");
        res.render("users/edit-agency",{
            title:  "Edit Agency",
            agency:agency
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postEditAgency = async (req,res)=>{
    try{
        var id = req.params.id;
        var name = req.body.name;
        var tax = req.body.tax;
        var manager = req.body.manager;
        var managerPassport = req.body.managerPassport;
        var address = req.body.address;
        var phone = req.body.phone;
        if(name!=""){await Agency.updateOne({_id:id},{name:name});}
        if(tax!=""){await Agency.updateOne({_id:id},{tax:tax});}
        if(manager!=""){await Agency.updateOne({_id:id},{manager:manager});}
        if(managerPassport!=""){await Agency.updateOne({_id:id},{managerPassport:managerPassport});}
        if(address!=""){await Agency.updateOne({_id:id},{address:address});}
        if(phone!=""){await Agency.updateOne({_id:id},{phone:phone});}
        res.redirect("/agency");
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditCompany = async (req,res)=>{
    try{
        var id = req.params.id;
        var company = await Company.findOne({_id:id}).sort("name");
        res.render("users/edit-company",{
            title:  "Edit Company",
            company:company
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postEditCompany = async (req,res)=>{
    try{
        var id = req.params.id;
        var name = req.body.name;
        var tax = req.body.tax;
        var manager = req.body.manager;
        var address = req.body.address;
        var phone = req.body.phone;
        var commission = req.body.commission;
        if(name!=""){await Company.updateOne({_id:id},{name:name});}
        if(tax!=""){await Company.updateOne({_id:id},{tax:tax});}
        if(manager!=""){await Company.updateOne({_id:id},{manager:manager});}
        if(address!=""){await Company.updateOne({_id:id},{address:address});}
        if(phone!=""){await Company.updateOne({_id:id},{phone:phone});}
        if(commission!=""){await Company.updateOne({_id:id},{commission:commission});}
        res.redirect("/company");
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditEmployee = async (req,res)=>{
    try{
        var agencyList = await Agency.find().sort("name");
        var jobList = await Employee.find().distinct("job");
        var id = req.params.id;
        var employee = await Employee.findOne({_id:id}).sort("name");
        res.render("users/edit-employee",{
            title:  "Edit Employee",
            agencyList:agencyList,
            jobList:jobList,
            employee:employee,
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postEditEmployee = async (req,res)=>{
    try{
        var id = req.params.id
        var name = req.body.name;
        var nationality = req.body.nationality;
        var passport = req.body.passport;
        var sgk = req.body.sgk;
        var birthdate = req.body.birthdate;
        var email = req.body.email;
        var phone = req.body.phone;
        var agency = req.body.agency;
        var job = req.body.job;
        var salary = req.body.salary;
        if(name!=""){await Employee.updateOne({_id:id},{name:name});}
        if(nationality!=""){await Employee.updateOne({_id:id},{nationality:nationality});}
        if(passport!=""){await Employee.updateOne({_id:id},{passport:passport});}
        if(sgk!=""){await Employee.updateOne({_id:id},{sgk:sgk});}
        if(birthdate!=""){await Employee.updateOne({_id:id},{birthdate:birthdate});}
        if(email!=""){await Employee.updateOne({_id:id},{email:email});}
        if(phone!=""){await Employee.updateOne({_id:id},{phone:phone});}
        if(agency!=""){await Employee.updateOne({_id:id},{agency:agency});}
        if(job!=""){await Employee.updateOne({_id:id},{job:job});}
        if(salary!=""){await Employee.updateOne({_id:id},{salary:salary});}
        res.redirect("/employee");
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditInsured = async (req,res)=>{
    try{
        var id = req.params.id;
        var insured = await Insured.findOne({_id:id}).sort("name");
        res.render("users/edit-insured",{
            title:  "Edit Insured",
            insured:insured
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postEditInsured = async (req,res)=>{
    try{
        var id = req.params.id
        var name = req.body.name;
        var nationality = req.body.nationality;
        var passport = req.body.passport;
        var birthdate = req.body.birthdate;
        var email = req.body.email;
        var phone = req.body.phone;
        if(name!=""){await Insured.updateOne({_id:id},{name:name});}
        if(nationality!=""){await Insured.updateOne({_id:id},{nationality:nationality});}
        if(passport!=""){await Insured.updateOne({_id:id},{passport:passport});}
        if(birthdate!=""){await Insured.updateOne({_id:id},{birthdate:birthdate});}
        if(email!=""){await Insured.updateOne({_id:id},{email:email});}
        if(phone!=""){await Insured.updateOne({_id:id},{phone:phone});}
        res.redirect("/insured");
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditPolicy = async (req,res)=>{
    try{
        var id = req.params.id;
        var policy = await Policy.findOne({_id:id});
        var insuredList = await Insured.find().sort("name");
        var companyList = await Company.find().sort("name");
        var casco  = await Policy_Casco.findOne({policy:id});
        var traffic  = await Policy_Traffic.findOne({policy:id});
        var dask  = await Policy_Dask.findOne({policy:id});
        var property  = await Policy_Property.findOne({policy:id});
        var health  = await Policy_Health.findOne({policy:id});
        var other  = await Policy_Other.findOne({policy:id});
        res.render("users/edit-policy",{
            title:  "Edit Policy",
            insuredList:insuredList,
            companyList:companyList,
            policy:policy,
            casco:casco,
            traffic:traffic,
            dask:dask,
            property:property,
            health:health,
            other:other
        });
    }
    catch{
        console.log("Error!");
    }
}
exports.postEditPolicy = async (req,res)=>{
    try{
        var id = req.params.id;
        var insured = req.body.insured;
        var company = req.body.company;
        var price = req.body.price;
        if(insured!=""){await Policy.updateOne({_id:id},{insured:insured});}
        if(company!=""){await Policy.updateOne({_id:id},{company:company});}
        if(price!=""){
            var companyCommission = await Policy.findOne({_id:id}).populate("company");
            var commissionRate = companyCommission.company.commission;
            var commission = price*commissionRate/100;
            await Policy.updateOne({_id:id},{totalPrice:price});
            await Policy.updateOne({_id:id},{commission:commission});
            await Policy.updateOne({_id:id},{companyShare:price-commission});
        }
        if(await Policy_Casco.findOne({policy:id})){
            var plate = req.body.plate;
            var chassis = req.body.chassis;
            if(plate!=""){await Policy_Casco.updateOne({policy:id},{plate:plate});}
            if(chassis!=""){await Policy_Casco.updateOne({policy:id},{chassis:chassis});}
            res.redirect("/policy-casco");
        }
        if(await Policy_Traffic.findOne({policy:id})){
            var plate = req.body.plate;
            var chassis = req.body.chassis;
            if(plate!=""){await Policy_Traffic.updateOne({policy:id},{plate:plate});}
            if(chassis!=""){await Policy_Traffic.updateOne({policy:id},{chassis:chassis});}
            res.redirect("/policy-traffic");
        }
        if(await Policy_Dask.findOne({policy:id})){
            var deed = req.body.deed;
            var address = req.body.address;
            if(deed!=""){await Policy_Dask.updateOne({deed:id},{deed:deed});}
            if(address!=""){await Policy_Dask.updateOne({policy:id},{address:address});}
            res.redirect("/policy-dask");
        }
        if(await Policy_Property.findOne({policy:id})){
            var deed = req.body.deed;
            var address = req.body.address;
            if(deed!=""){await Policy_Property.updateOne({policy:id},{deed:deed});}
            if(address!=""){await Policy_Property.updateOne({policy:id},{address:address});}
            res.redirect("/policy-property");
        }
        if(await Policy_Health.findOne({policy:id})){
            var sgk = req.body.sgk;
            if(sgk!=""){await Policy_Health.updateOne({policy:id},{sgk:sgk});}
            res.redirect("/policy-health");
        }
        if(await Policy_Other.findOne({policy:id})){
            var invoice = req.body.invoice;
            var order = req.body.order;
            if(invoice!=""){await Policy_Other.updateOne({policy:id},{invoice:invoice});}
            if(order!=""){await Policy_Other.updateOne({policy:id},{order:order});}
            res.redirect("/policy-other");
        }
    }
    catch{
        console.log("Error!");
    }
}
exports.getAgency = async (req,res)=>{
    try{
        var agency = await Agency.find().sort("name");
        res.render("users/agency",{
            title:  "Agency",
            agency:agency

        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postAgency = async (req,res)=>{
    try{
        
        var agency = await Agency.find();
        var value = req.body.delete;
        if(value){
            for(i=0;i<agency.length;i++){
                if(agency[i]._id==value){
                    await Agency.deleteOne({_id:value});
                    await Employee.deleteOne({agency:value});
                    await Policy.deleteOne({agency:value});
                    await Expense.deleteOne({agency:value});
                    await Insured.deleteOne({agency:value});
                }
            }
            res.redirect("/agency");
        }
        else{
            var query = req.body.query;
            var filter = await Agency.find({name:new RegExp(query,"i")}).sort("name");
            res.render("users/agency",{
                title:  "Agency",
                agency:filter

            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getCompany = async (req,res)=>{
    try{
        var company = await Company.find().sort("name");
        res.render("users/company",{
            title:  "Company",
            company:company
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postCompany = async (req,res)=>{
    try{
        var company = await Company.find();
        var value = req.body.delete;
        if(value){
            for(i=0;i<company.length;i++){
                if(company[i]._id==value){
                    await Company.deleteOne({_id:value});
                    await Policy.deleteOne({company:value});
                }
            }
            res.redirect("/company");
        }
        else{
            var query = req.body.query;
            var filter = await Company.find({name:new RegExp(query,"i")}).sort("name");
            res.render("users/company",{
                title:  "Company",
                company:filter

            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getEmployee = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var employee = await Employee.find().where("job").ne("Administrator").populate("agency");
            res.render("users/employee",{
                title:  "Employee",
                employee:employee
            });
        }
        else {
            var agency = req.session.agency;
            var employee = await Employee.find({agency:agency}).where("job").ne("Agency Manager").populate("agency").sort("name");
            res.render("users/employee",{
                title:  "Employee",
                employee:employee
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postEmployee = async (req,res)=>{
    try{
        var employee = await Employee.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<employee.length;i++){
            if(employee[i]._id==value){
                await Employee.deleteOne({_id:value});
                await User.deleteOne({employee:value});
            }
        }
        res.redirect("/employee");
        }
        else{
            var query = req.body.query;
            var filter = await Employee.find({name:new RegExp(query,"i")}).sort("name");
            res.render("users/employee",{
                title:  "Employee",
                employee:filter

            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getInsured = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var insured = await Insured.find().sort("name");
            res.render("users/insured",{
                title:  "Insured",
                insured:insured
            });
        }
        else{
            var insured = await Insured.find().sort("name");
            res.render("users/insured",{
                title:  "Insured",
                insured:insured
            });
        }



        
    }
    catch{
        console.log("Error!");
    }
},
exports.postInsured = async (req,res)=>{
    try{
        var insured = await Insured.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<insured.length;i++){
            if(insured[i]._id==value){
                await Insured.deleteOne({_id:value});
                await Policy.deleteOne({insured:value});
            }
        }
        res.redirect("/insured");
    }
        else{
            var query = req.body.query;
            var filter = await Insured.find({name:new RegExp(query,"i")}).sort("name");
            res.render("users/insured",{
                title:  "Insured",
                insured:filter

            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyCasco = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var casco = await Policy_Casco.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-casco",{
                title:  "Casco Policy",
                casco:casco,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var casco = await Policy_Casco.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-casco",{
                title:  "Casco Policy",
                casco:casco,
            });
        }
        else{
            var user = req.session.user;
            var casco = await Policy_Casco.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-casco",{
                title:  "Casco Policy",
                casco:casco,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyCasco = async (req,res)=>{
    try{
        var casco = await Policy_Casco.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<casco.length;i++){
            if(casco[i].policy==value){
                await Policy_Casco.deleteOne({policy:value});
                await Policy.deleteOne({_id:value});
            }
        }
        res.redirect("/policy-casco");
    }
        else{
            var query = req.body.query;
            var filter = await Policy_Casco.find({$or:[
                {chassis:new RegExp(query,"i")},
                {plate:new RegExp(query,"i")}
            ]}).where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-casco",{
                title:  "Casco Policy",
                casco:filter,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyTraffic = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var traffic = await Policy_Traffic.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-traffic",{
                title:  "Traffic Policy",
                traffic:traffic,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var traffic = await Policy_Traffic.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-traffic",{
                title:  "Traffic Policy",
                traffic:traffic,
            });
        }
        else{
            var user = req.session.user;
            var traffic = await Policy_Traffic.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-traffic",{
                title:  "Traffic Policy",
                traffic:traffic,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyTraffic = async (req,res)=>{
    try{
        var traffic = await Policy_Traffic.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<traffic.length;i++){
            if(traffic[i].policy==value){
                await Policy_Traffic.deleteOne({policy:value});
                await Policy.deleteOne({_id:value});
            }
        }
        res.redirect("/policy-traffic");
    }
        else{
            var query = req.body.query;
            var filter = await Policy_Traffic.find({$or:[
                {chassis:new RegExp(query,"i")},
                {plate:new RegExp(query,"i")}
            ]}).where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-traffic",{
                title:  "Traffic Policy",
                traffic:filter,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyDask= async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var dask = await Policy_Dask.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-dask",{
                title:  "DASK Policy",
                dask:dask,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var dask = await Policy_Dask.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-dask",{
                title:  "DASK Policy",
                dask:dask,
            });
        }
        else{
            var user = req.session.user;
            var dask = await Policy_Dask.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-dask",{
                title:  "DASK Policy",
                dask:dask,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyDask = async (req,res)=>{
    try{
        var dask = await Policy_Dask.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<dask.length;i++){
            if(dask[i].policy==value){
                await Policy_Dask.deleteOne({policy:value});
                await Policy.deleteOne({_id:value});
            }
        }
        res.redirect("/policy-dask");
    }
        else{
            var query = req.body.query;
            var filter = await Policy_Dask.find({deed:new RegExp(query,"i")})
            .where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-dask",{
                title:  "DASK Policy",
                dask:filter,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyProperty = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var property = await Policy_Property.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-property",{
                title:  "Property Policy",
                property:property,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var property = await Policy_Property.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-property",{
                title:  "Property Policy",
                property:property,
            });
        }
        else{
            var user = req.session.user;
            var property = await Policy_Property.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-property",{
                title:  "Property Policy",
                property:property,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyProperty = async (req,res)=>{
    try{
        var property = await Policy_Property.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<property.length;i++){
            if(property[i].policy==value){
                await Policy_Property.deleteOne({policy:value});
                await Policy.deleteOne({_id:value});
            }
        }
        res.redirect("/policy-property");
    }
        else{
            var query = req.body.query;
            var filter = await Policy_Property.find({deed:new RegExp(query,"i")})
            .where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-property",{
                title:  "Property Policy",
                property:filter,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyHealth = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var health = await Policy_Health.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-health",{
                title:  "Health Policy",
                health:health,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var health = await Policy_Health.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-health",{
                title:  "Health Policy",
                health:health,
            });
        }
        else{
            var user = req.session.user;
            var health = await Policy_Health.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-health",{
                title:  "Health Policy",
                health:health,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyHealth = async (req,res)=>{
    try{
        var health = await Policy_Health.find();
        var value = req.body.delete;
        if(value){
            for(i=0;i<health.length;i++){
                if(health[i].policy==value){
                    await Policy_Health.deleteOne({policy:value});
                    await Policy.deleteOne({_id:value});
                }
            }
            res.redirect("/policy-health");
        }
        else{
            var query = req.body.query;
            var filter = await Policy_Health.find({sgk:new RegExp(query,"i")})
            .where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-health",{
                title:  "Health Policy",
                health:filter
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getPolicyOther = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var other = await Policy_Other.find().where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-other",{
                title:  "Other Policy",
                other:other,
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var other = await Policy_Other.find().where("policy").equals(await Policy.find({agency:agency})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-other",{
                title:  "Other Policy",
                other:other,
            });
        }
        else{
            var user = req.session.user;
            var other = await Policy_Other.find().where("policy").equals(await Policy.find({user:user})).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-other",{
                title:  "Other Policy",
                other:other,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postPolicyOther = async (req,res)=>{
    try{
        var other = await Policy_Other.find();
        var value = req.body.delete;
        if(value){
        for(i=0;i<other.length;i++){
            if(other[i].policy==value){
                await Policy_Other.deleteOne({policy:value});
                await Policy.deleteOne({_id:value});
            }
        }
        res.redirect("/policy-other");
    }
        else{
            var query = req.body.query;
            var filter = await Policy_Other.find({$or:[
                {invoice:new RegExp(query,"i")},
                {order:new RegExp(query,"i")}
            ]}).where("policy").equals(await Policy.find()).populate({
                path:"policy",
                populate:{
                    path:"insured",
                    model:"Insured"
                }
            });
            res.render("users/policy-other",{
                title:  "Other Policy",
                other:filter,
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportIncome = async (req,res)=>{
    try{
        var month = (Date.split("-")[0].split(".")[1]);
        var monthList = [{no:"01",name:"January",income:0,expense:0},{no:"02",name:"February",income:0,expense:0},
            {no:"03",name:"March",income:0,expense:0},{no:"04",name:"April",income:0,expense:0},{no:"05",name:"May",income:0,expense:0},
            {no:"06",name:"June",income:0,expense:0},{no:"07",name:"July",income:0,expense:0},{no:"08",name:"August",income:0,expense:0},
            {no:"09",name:"September",income:0,expense:0},{no:"10",name:"October",income:0,expense:0},{no:"11",name:"November",income:0,expense:0},
            {no:"12",name:"December",income:0,expense:0},]
        var policyList = await Policy.find().populate("agency");
        var agency = await Agency.find().sort({agency:-1});
        var count=[],companyShare=[],commission=[],totalPrice=[];
        for(i=0;i<policyList.length;i++){
            for(j=0;j<agency.length;j++){
                count.push(0);
                companyShare.push(0);
                commission.push(0);
                totalPrice.push(0);
                if(policyList[i].agency.name==agency[j].name && policyList[i].date.split("-")[0].split(".")[1]==month){
                    count[j]++;
                    companyShare[j]+=policyList[i].companyShare;
                    commission[j]+=policyList[i].commission;
                    totalPrice[j]+=policyList[i].totalPrice;
                    companyShare[j]=Math.round(companyShare[j]);
                    commission[j]=Math.round(commission[j]);
                    totalPrice[j]=Math.round(totalPrice[j]);
                }
            }
        }
        res.render("users/report-income",{
            title:  "Income Report",
            agency:agency,
            count:count,
            companyShare:companyShare,
            commission:commission,
            totalPrice:totalPrice,
            month:month,
            monthList:monthList
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportExpense = async (req,res)=>{
    try{
        var totalExpense = [];
        var month = Date.split("-")[0].split(".")[1];
        var monthList = [{no:"01",name:"January",income:0,expense:0},{no:"02",name:"February",income:0,expense:0},
            {no:"03",name:"March",income:0,expense:0},{no:"04",name:"April",income:0,expense:0},{no:"05",name:"May",income:0,expense:0},
            {no:"06",name:"June",income:0,expense:0},{no:"07",name:"July",income:0,expense:0},{no:"08",name:"August",income:0,expense:0},
            {no:"09",name:"September",income:0,expense:0},{no:"10",name:"October",income:0,expense:0},{no:"11",name:"November",income:0,expense:0},
            {no:"12",name:"December",income:0,expense:0},]
        var expenseList = await Expense.find({month:month}).populate("agency");
        for(i=0;i<expenseList.length;i++){
            totalExpense.push(0);
            totalExpense[i]=expenseList[i].bill+expenseList[i].rent+expenseList[i].supply+expenseList[i].salary+expenseList[i].salaryTax;
            totalExpense[i]=Math.round(totalExpense[i]);
        }
        res.render("users/report-expense",{
            title:  "Expense Report",
            expenseList:expenseList,
            totalExpense:totalExpense,
            date:Date,
            monthList:monthList,
            month:month
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportProfit = async (req,res)=>{
    try{
        var month = Date.split("-")[0].split(".")[1];
        var monthList = [{no:"01",name:"January",income:0,expense:0},{no:"02",name:"February",income:0,expense:0},
            {no:"03",name:"March",income:0,expense:0},{no:"04",name:"April",income:0,expense:0},{no:"05",name:"May",income:0,expense:0},
            {no:"06",name:"June",income:0,expense:0},{no:"07",name:"July",income:0,expense:0},{no:"08",name:"August",income:0,expense:0},
            {no:"09",name:"September",income:0,expense:0},{no:"10",name:"October",income:0,expense:0},{no:"11",name:"November",income:0,expense:0},
            {no:"12",name:"December",income:0,expense:0},]
        var income=[],expense=[],profit=[];
        var policyList = await Policy.find().populate("agency");
        var expenseList = await Expense.find({month:month}).populate("agency");
        var agency = await Agency.find().distinct("name");
        for(i=0;i<policyList.length;i++){
            for(j=0;j<expenseList.length;j++){
                income.push(0);
                if(policyList[i].agency.name==expenseList[j].agency.name && policyList[i].date.split("-")[0].split(".")[1]==month){
                    income[j]+=policyList[i].commission;
                    income[j]=Math.round(income[j]);
                }
            }
        }
        for(i=0;i<expenseList.length;i++){
            expense.push(0);
            expense[i]=expenseList[i].bill+expenseList[i].rent+expenseList[i].supply+expenseList[i].salary+expenseList[i].salaryTax;
            expense[i]=Math.round(expense[i]);
        }
        for(i=0;i<agency.length;i++){
            profit.push(0);
            profit[i]=income[i]-expense[i];
        }
        res.render("users/report-profit",{
            title:  "Profit Report",
            expenseList:expenseList,
            income:income,
            expense:expense,
            profit:profit,
            month:month,
            monthList:monthList
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportCompany = async (req,res)=>{
    try{
        var month = Date.split("-")[0].split(".")[1];
        var company = await Company.find().distinct("name");
        var companyList = await Company.find();
        var policy = await Policy.find().populate("company");
        var commission =[],price=[],companyRate=[];
        for(i=0;i<company.length;i++){
            for(j=0;j<policy.length;j++){
                if(company[i]==policy[j].company.name && policy[j].date.split("-")[0].split(".")[1]==month){
                    commission.push(0);
                    price.push(0);
                    commission[i]+=policy[j].commission;
                    price[i]+=policy[j].totalPrice; 
                    commission[i]=Math.round(commission[i]);
                    price[i]=Math.round(price[i]);
                }
            }
        }
        for(i=0;i<company.length;i++){
            for(j=0;j<companyList.length;j++){
                if(companyList[j].name==company[i])
                companyRate.push(companyList[j].commission);
            }
        }
        res.render("users/report-company",{
            title:  "Company Report",
            company:company,
            policy:policy,
            commission:commission,
            price:price,
            companyRate:companyRate
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportSalary = async (req,res)=>{
    try{
        var employee = await Employee.find().where("name").ne("Sena Şen");
        var salaryTax = [];
        for(i=0;i<employee.length;i++){
            salaryTax[i]=Math.round(employee[i].salary*0.1);
        }
        res.render("users/report-salary",{
            title:  "Salary Report",
            employee:employee,
            salaryTax:salaryTax
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportInsured = async (req,res)=>{
    try{
        var insured = await Insured.find().distinct("name");
        var policy = await Policy.find().populate("insured");
        var count = [];
        var companyShare = [];
        var commission = [];
        var price = [];
        for(i=0;i<policy.length;i++){
            for(j=0;j<insured.length;j++){
                count.push(0);
                companyShare.push(0);
                commission.push(0);
                price.push(0);
                if(policy[i].insured.name==insured[j]){
                    count[j]++;
                    companyShare[j]+=policy[i].companyShare;
                    commission[j]+=policy[i].commission;
                    price[j]+=policy[i].totalPrice;
                    companyShare[j]=Math.round(companyShare[j]);
                    commission[j]=Math.round(commission[j]);
                    price[j]=Math.round(price[j]);
                }
            }
        } 
        res.render("users/report-insured",{
            title:  "Insured Report",
            insured:insured,
            policy:policy,
            count:count,
            companyShare:companyShare,
            commission:commission,
            price:price
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getReportTransactions = async (req,res)=>{
    try{
        var policy = await Policy.find().populate("insured");
        res.render("users/report-transaction",{
            title:  "Transactions Report",
            policy:policy,
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getUsers = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var employee = await Employee.find().where("_id").ne("660064294402d8f650041213").populate("agency"); 
            var user = await User.find().where("employee").ne("660064294402d8f650041213").populate({
                path:"employee",
                model:"Employee",
                populate:{
                    path:"agency",
                    model:"Agency"
                }
            }).sort({employee:1});
            res.render("users/users",{
                title:  "Users",
                user:user,
                employee:employee
            });
        }
        else if(!isAdmin && isManager){
            var agency = req.session.agency;
            var employee = await Employee.find({agency:agency}).populate("agency"); 
            var user = await User.find({employee:employee}).where("employee").ne("660064294402d8f650041213").populate({
                path:"employee",
                model:"Employee",
                populate:{
                    path:"agency",
                    model:"Agency"
                }
            }).sort("employee");
            res.render("users/users",{
                title:  "Users",
                user:user,
                employee:employee
            });
        }
        else{
            res.redirect("/restricted");
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postUsers = async (req,res)=>{
    try{
        var users = await User.find();
        var value = req.body.delete;
        if(value){
            for(i=0;i<users.length;i++){
                if(users[i]._id==value){
                    await User.deleteOne({_id:value});
                }
            }
        }
        else{
            var employee = req.body.employee;
            var password = req.body.password;
            var isManager = req.body.isManager;
            var isAdmin = req.body.isAdmin;
            await User.create({employee:employee,password:password,isManager:isManager,isAdmin:isAdmin});
        }  
        res.redirect("/users");
    }
    catch{
        console.log("Error!");
    }
},
exports.getEditUsers = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin && isManager){
            var agencyList = await Agency.find();
            var jobList = await Employee.find().distinct("job");
            var id = req.params.id;
            var user = await User.findOne({_id:id}).populate("employee");
            res.render("users/edit-user",{
                title:  "Edit User",
                agencyList:agencyList,
                jobList:jobList,
                user:user
            });
        }
        else{
            var agency = req.session.agency;
            var agencyList = await Agency.find({_id:agency});
            var jobList = await Employee.find({agency:agency}).distinct("job");
            var id = req.params.id;
            var employee = await Employee.find({agency:agency});
            var user = await User.findOne({_id:id,employee:employee}).populate("employee");
            if(user){
                res.render("users/edit-user",{
                    title:  "Edit User",
                    agencyList:agencyList,
                    jobList:jobList,
                    user:user
                });
            }
            else{
                res.redirect("/restricted");
            }
            
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.postEditUsers = async (req,res)=>{
    try{
        var id = req.params.id;
        var user = await User.findOne({_id:id}).populate("employee");
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var agency = req.body.agency;
        var job = req.body.job;
        var hashedPassword = await bcrypt.hash(password,10);
        if(name!=""){await Employee.updateOne({_id:user.employee},{name:name});}
        if(email!=""){await Employee.updateOne({_id:user.employee},{email:email});}
        if(password!=""){await User.updateOne({_id:id},{password:hashedPassword});}
        if(agency!=""){await Employee.updateOne({_id:user.employee},{agency:agency});}
        if(job!=""){await Employee.updateOne({_id:user.employee},{job:job});}

        res.redirect("/users");
    }
    catch{
        console.log("Error!");
    }
},
exports.getProfile = async (req,res)=>{
    try{
        var agencyList = await Agency.find();
        var jobList = await Employee.find().distinct("job");
        var userId = req.session.user;
        var user = await User.findOne({_id:userId}).populate("employee");
        res.render("users/profile",{
            title:  "Profile",
            agencyList:agencyList,
            jobList:jobList,
            user:user
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.postProfile = async (req,res)=>{
    try{
        var password = req.body.password;
        var userId = req.session.user;
        var user = await User.findOne({_id:userId}).populate("employee");
        var name = req.body.name;
        var email = req.body.email;
        var hashedPassword = await bcrypt.hash(password,10);
        var agency = req.body.agency;
        var job = req.body.job;
        if(name!=""){await Employee.updateOne({_id:user.employee},{name:name});}
        if(email!=""){await Employee.updateOne({_id:user.employee},{email:email});}
        if(password!=""){await User.updateOne({_id:userId},{password:hashedPassword});}
        if(agency!=""){await Employee.updateOne({_id:user.employee},{agency:agency});}
        if(job!=""){await Employee.updateOne({_id:user.employee},{job:job});}

        res.redirect("/profile");
    }
    catch{
        console.log("Error!");
    }
},
exports.getFaq = async (req,res)=>{
    try{
        res.render("users/faq",{
            title:  "FAQ"
        });
    }
    catch{
        console.log("Error!");
    }
},
exports.getRestricted = async (req,res)=>{
    try{
        var isAdmin = req.session.isAdmin;
        var isManager = req.session.isManager;
        if(isAdmin){
            res.redirect("/404");
        }
        else{
            res.render("users/restricted",{
                title:  "Restricted Page",
                isAdmin:isAdmin,
                isManager:isManager
            });
        }
    }
    catch{
        console.log("Error!");
    }
},
exports.get404 = async (req,res)=>{
    try{
            res.render("users/404",{
                title:  "Page Not Found"
            });
    }
    catch{
        console.log("Error!");
    }
},
exports.getSignOut = async (req,res)=>{
    try{
        await req.session.destroy();
        res.redirect("/");
    }
    catch{
        console.log("Error!");
    }
}