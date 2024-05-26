const bcrypt = require('bcrypt');
const Agency = require("../models/agency");
const Company = require("../models/company");
const Employee = require("../models/employee");
const User =  require("../models/user");
const Insured = require("../models/insured");
const Policy = require("../models/policy");
const Expense = require("../models/expense");
const policyCasco = require('../models/policy-casco');
const policyTraffic = require('../models/policy-traffic');
const policyDask = require('../models/policy-dask');
const policyProperty = require('../models/policy-property');
const policyHealth = require('../models/policy-health');
const policyOther = require('../models/policy-other');

async function dummyData(){

    // Company.insertMany([
    //     { name:"Sompo",tax:"3870197553",manager:"Recai Dalaş",address:"Beykoz,Çam Pınarı St.No:10",
    // phone:"+90 850 250 81 81",commission:12},

    //     { name:"Anadolu",tax:"0680061327",manager:"Mehmet Tuğtan",address:"Kavacık,Rüzgârlıbahçe,Kavak St.No:31",
    // phone:"+90 850 744 0744",commission:10},

    //     { name:"Allianz",tax:"4560007035",manager:"Tolga Gürkan",address:"Küçükbakkalköy,Kayışdağı St.No:1",
    // phone:"+90 850 399 9999	",commission:15},

    //     { name:"HDI",tax:"4700032959",manager:"Firuzan İşcan",address:"Kadıköy,Sahrayı Cedit,Batman St.No:6A",
    // phone:"+90 216 600 62 80",commission:15},

    //     { name:"Axa",tax:"6310572928",manager:"Thomas Buberl",address:"Beyoğlu,Kılıçali Paşa,Meclis-i Mebusan St.No:15",
    // phone:"+90 212 334 24 24",commission:15},
    
    //     { name:"Eureko",tax:"0080067525",manager:"Süha Çele",address:"Altunizade,Ord. Prof. Dr. Fahrettin Kerim Gökay St.No:20",
    // phone:"+90 850 222 66 60",commission:15},
    // ]);



    // Agency.insertMany([
    //     {name:"Actuary Center Office",tax:"174256920",manager:"Sena Şen",managerPassport:"22718962452", address:"Ümraniye,Esenevler,No:42/8",
    //     phone:"+90 216 552 26 42"},

    //     {name:"Ümraniye Agency",tax:"264585397",manager:"Ayşe Kurt",managerPassport:"12762648302", address:"Ümraniye,Atatürk St.No:76/8",
    //     phone:"+90 216 557 56 46"},

    //     {name:"Kadıköy Agency",tax:"314685634",manager:"Bünyamin Doğru",managerPassport:"36482016811", address:"Kadıköy,İnönü St.No:21/4",
    //     phone:"+90 216 582 82 57"},

    //     {name:"Maltepe Agency",tax:"114685752",manager:"Fadime Durmaz",managerPassport:"20748962642", address:"Maltepe,Mimar Sinan St.No:16/2",
    //     phone:"+90 216 522 24 38"},
    // ]);



    // Employee.insertMany([
    //     {name: "Sena Şen",nationality:"T.C" ,passport:"22718962452" ,sgk:"12763842" ,birthdate:"12.12.1988" ,email:"sensena@hotmail.com" 
    //     ,phone:"+90 542 436 76 45" ,agency:"660060e3d33ac43931bdce4b" ,job: "Administrator",salary: 52000},

    //     {name: "İpek Köroğlu",nationality:"T.C" ,passport:"21174684112" ,sgk:"15426985" ,birthdate:"01.11.1992" ,email:"koroglu.i92@gmail.com" 
    //     ,phone:"+90 502 242 22 82" ,agency:"660060e3d33ac43931bdce4b" ,job: "Secretary",salary: 17582},

    //     {name: "Ayşe Kurt",nationality:"T.C" ,passport:"21148542602" ,sgk:"14024562" ,birthdate:"15.11.1974" ,email:"ayseee1996@gmail.com" 
    //     ,phone:"+90 554 324 42 72" ,agency:"660060e3d33ac43931bdce4c" ,job: "Agency Manager",salary: 25250},

    //     {name: "Buse Aslan",nationality:"T.C" ,passport:"22718119644" ,sgk:"12568472" ,birthdate:"02.01.2001" ,email:"busee.aslan1@icloud.com" 
    //     ,phone:"+90 507 956 76 21" ,agency:"660060e3d33ac43931bdce4c" ,job: "Insurer",salary: 17582},

    //     {name: "Fadime Durmaz",nationality:"T.C" ,passport:"21468525107" ,sgk:"17756325" ,birthdate:"19.04.1961" ,email:"fadimedurmaz61@gmail.com" 
    //     ,phone:"+90 554 342 87 23" ,agency:"660060e3d33ac43931bdce4c" ,job: "Cleaner",salary: 17582},

    //     {name: "Bünyamin Doğru",nationality:"T.C" ,passport:"19428602163" ,sgk:"36725690" ,birthdate:"10.06.1985" ,email:"bunyamindogruu@hotmail.com" 
    //     ,phone:"+90 556 642 12 36" ,agency:"660060e3d33ac43931bdce4d" ,job: "Agency Manager",salary: 25250},

    //     {name: "Kadir Altıncı",nationality:"T.C" ,passport:"22741236593" ,sgk:"17423356" ,birthdate:"05.03.1994" ,email:"altinci.kadir91@hotmail.com" 
    //     ,phone:"+90 552 964 64 46" ,agency:"660060e3d33ac43931bdce4d" ,job: "Insurer",salary: 17852},

    //     {name: "Fatıma Özsoy",nationality:"T.C" ,passport:"17428634611" ,sgk:"14754632" ,birthdate:"07.07.1971" ,email:"fatima.ozsoy@hotmail.com" 
    //     ,phone:"+90 542 655 42 11" ,agency:"660060e3d33ac43931bdce4d" ,job: "Cleaner",salary: 17852},

    //     {name: "Fatma Kırılmaz",nationality:"T.C" ,passport:"23465215931" ,sgk:"18963582" ,birthdate:"21.08.1966" ,email:"fadimedurmaz004@gmail.com" 
    //     ,phone:"+90 507 956 56 66" ,agency:"660060e3d33ac43931bdce4e" ,job: "Agency Manager",salary: 25250},

    //     {name: "Yılmaz Bozok",nationality:"T.C" ,passport:"24445626102" ,sgk:"15140263" ,birthdate:"22.10.1998" ,email:"yilmaz_bozok@hotmail.com" 
    //     ,phone:"+90 506 774 56 44" ,agency:"660060e3d33ac43931bdce4e" ,job: "Insurer",salary: 17852},

    //     {name: "Saniye Kaya",nationality:"T.C" ,passport:"18887126917" ,sgk:"11428634" ,birthdate:"22.06.1973" ,email:"saniyekaya47@hotmail.com" 
    //     ,phone:"+90 534 12 87" ,agency:"660060e3d33ac43931bdce4e" ,job: "Cleaner",salary: 17852}, 
    // ]);



    //  User.insertMany([
    //      {employee:"660064294402d8f650041213",password:"sena123",isAdmin:true,isManager:true},
    //      {employee:"660064294402d8f650041215",password:"ayse.3446$$",isAdmin:false,isManager:true},
    //      {employee:"660064294402d8f650041216",password:"a412678+-",isAdmin:false,isManager:false},
    //      {employee:"660064294402d8f650041218",password:"12345.,.,",isAdmin:false,isManager:true},
    //      {employee:"660064294402d8f650041219",password:"KaDiR6...",isAdmin:false,isManager:false},
    //      {employee:"660064294402d8f65004121b",password:"fatma.123.,",isAdmin:false,isManager:true},
    //      {employee:"660064294402d8f65004121c",password:"YiLMaZ98xyz",isAdmin:false,isManager:false}
    //  ]);



    //  Insured.insertMany([
    //      {name: "Ahmet Yılmaz",nationality:"T.C",passport:"21364852647",birthdate:"17.11.1967",email:"ahmet.y67@gmail.com",phone:"+90 544 613 47 52"},
    //      {name: "Fatma Yavuz",nationality:"T.C",passport:"12360823543",birthdate:"24.11.1976",email:"fatmayavuz@hotmail.com",phone:"+90 546 217 17 37"},
    //      {name: "Ahmet Taş",nationality:"T.C",passport:"21638741264",birthdate:"06.09.1988",email:"tas.ahmet.88@hotmail.com",phone:"+90 506 744 26 29"},
    //      {name: "Mehmet Yol",nationality:"T.C",passport:"19425682105",birthdate:"10.09.1957",email:"mehmetyol07@gmail.com",phone:"+90 535 644 56 74"},
    //      {name: "Yusuf Demir",nationality:"TT.CC",passport:"42638471216",birthdate:"16.02.1991",email:"yusufdemir@gmail.com",phone:"+90 536 213 47 82"},
    //      {name: "Özlem Birinci",nationality:"T.C",passport:"24364864137",birthdate:"10.10.1996",email:"ozlem1inci@hotmail.com",phone:"+90 506 642 76 32"},
    //      {name: "Şahin Yılmaz",nationality:"T.C",passport:"13425681604",birthdate:"19.10.1951",email:"s.yilmaz1951@gmail.com",phone:"+90 535 344 12 52"} 
    //  ]);



    //  Policy.insertMany([
    //      {company:"66005d50eaa5a6cb94057fd8",agency:"660060e3d33ac43931bdce4c",user:"660065de5e0c356b5281d1fe",
    //      insured:"66011a622781be56434e835f",totalPrice:4700,commission:658,companyShare:4042},

    //      {company:"66005d50eaa5a6cb94057fd9",agency:"660060e3d33ac43931bdce4d",user:"660065de5e0c356b5281d200",
    //      insured:"66011a622781be56434e8360",totalPrice:8450,commission:845,companyShare:7650},

    //      {company:"66005d50eaa5a6cb94057fda",agency:"660060e3d33ac43931bdce4d",user:"660065de5e0c356b5281d200",
    //      insured:"66011a622781be56434e8362",totalPrice:12540,commission:1504,companyShare:11036},

    //      {company:"66005d50eaa5a6cb94057fdb",agency:"660060e3d33ac43931bdce4e",user:"660065de5e0c356b5281d202",
    //      insured:"66011a622781be56434e8362",totalPrice:7640,commission:1528,companyShare:6112},

    //      {company:"66005d50eaa5a6cb94057fdc",agency:"660060e3d33ac43931bdce4c",user:"660065de5e0c356b5281d1fe",
    //      insured:"66011a622781be56434e8363",totalPrice:11600,commission:2088,companyShare:9512}, 

    //      {company:"66005d50eaa5a6cb94057fdd",agency:"660060e3d33ac43931bdce4d",user:"660065de5e0c356b5281d200",
    //      insured:"66011a622781be56434e8364",totalPrice:9644,commission:1350,companyShare:8294},

    //      {company:"66005d50eaa5a6cb94057fd9",agency:"660060e3d33ac43931bdce4e",user:"660065de5e0c356b5281d202",
    //      insured:"66011a622781be56434e8365",totalPrice:15650,commission:1565,companyShare:14085}, 

    //      {company:"66005d50eaa5a6cb94057fdb",agency:"660060e3d33ac43931bdce4d",user:"660065de5e0c356b5281d200",
    //      insured:"66011a622781be56434e8361",totalPrice:27000,commission:5400,companyShare:21600},

    //      {company:"66005d50eaa5a6cb94057fdb",agency:"660060e3d33ac43931bdce4e",user:"660065de5e0c356b5281d202",
    //      insured:"66011a622781be56434e8361",totalPrice:9850,commission:1970,companyShare:7880}, 

    //      {company:"66005d50eaa5a6cb94057fdd",agency:"660060e3d33ac43931bdce4c",user:"660065de5e0c356b5281d1fe",
    //      insured:"66011a622781be56434e8361",totalPrice:10250,commission:1538,companyShare:8712}
    //  ]);



    // policyCasco.insertMany([
    //     {policy:"66012500b0dd1e561dac6a04",plate:"34FH655",chassis:"127685436955175"},
    //     {policy:"66012500b0dd1e561dac69ff",plate:"34LT4856",chassis:"786412036845521"},
    //     {policy:"66012500b0dd1e561dac6a03",plate:"34HB6427",chassis:"486456441259648"},
    //     {policy:"66012500b0dd1e561dac6a01",plate:"34SK2048",chassis:"784450169217068"},
    // ]);

    // policyTraffic.insertMany([
    //     {policy:"66012500b0dd1e561dac6a06",plate:"34FH655",chassis:"127685436955175"},
    //     {policy:"66012500b0dd1e561dac6a00",plate:"34LT4856",chassis:"786412036845521"}
    // ]);

    // policyDask.insertMany([
    //     {policy:"66012500b0dd1e561dac6a02",deed:"18467214",address:"Kadıköy,Koşuyolu St.No:228"}
    // ]);

    // policyProperty.insertMany([
    //     {policy:"66012500b0dd1e561dac69fe",deed:"12487456",address:"Ümraniye,Kireçfırını,No:28"}
    // ]);

    // policyHealth.insertMany([
    //     {policy:"66012500b0dd1e561dac6a05",sgk:"12425634"}
    // ]);

    // policyOther.insertMany([
    //     {policy:"66012500b0dd1e561dac69fd",invoice:"17425684",order:"157896321580"}
    // ]);



    //  Expense.insertMany([
    //      {agency:"660060e3d33ac43931bdce4b",bill:3272,rent:10800,supply:2300,salary:17582,salaryTax:2833},
    //      {agency:"660060e3d33ac43931bdce4c",bill:5742,rent:11200,supply:3100,salary:52746,salaryTax:8499},
    //      {agency:"660060e3d33ac43931bdce4d",bill:4876,rent:15500,supply:2800,salary:52746,salaryTax:8499},
    //      {agency:"660060e3d33ac43931bdce4e",bill:4598,rent:12400,supply:3400,salary:52746,salaryTax:8499},
    //  ]);
    
}
module.exports = dummyData;