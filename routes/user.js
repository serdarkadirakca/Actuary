const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const isAdmin = require("../middlewares/isAdmin");
const isManager = require("../middlewares/isManager");
const isAuth = require("../middlewares/isAuth");

router.get("/", userController.getIndex);
router.post("/", userController.postIndex);
router.get("/dashboard",isAuth, userController.getDashboard);
router.get("/register-agency",isAuth, userController.getRegisterAgency);
router.post("/register-agency",isAuth, userController.postRegisterAgency);
router.get("/register-company",isAuth, userController.getRegisterCompany);
router.post("/register-company",isAuth, userController.postRegisterCompany);
router.get("/register-employee",isAuth, userController.getRegisterEmployee);
router.post("/register-employee",isAuth, userController.postRegisterEmployee);
router.get("/register-insured",isAuth, userController.getRegisterInsured);
router.post("/register-insured",isAuth, userController.postRegisterInsured);
router.get("/register-expense",isAuth, userController.getRegisterExpense);
router.post("/register-expense",isAuth, userController.postRegisterExpense);
router.get("/register-casco",isAuth, userController.getRegisterCasco);
router.post("/register-casco",isAuth, userController.postRegisterCasco);
router.get("/register-traffic",isAuth, userController.getRegisterTraffic);
router.post("/register-traffic",isAuth, userController.postRegisterTraffic);
router.get("/register-dask",isAuth, userController.getRegisterDask);
router.post("/register-dask",isAuth, userController.postRegisterDask);
router.get("/register-property",isAuth, userController.getRegisterProperty);
router.post("/register-property",isAuth, userController.postRegisterProperty);
router.get("/register-health",isAuth, userController.getRegisterHealth);
router.post("/register-health",isAuth, userController.postRegisterHealth);
router.get("/register-other",isAuth, userController.getRegisterOther);
router.post("/register-other",isAuth, userController.postRegisterOther);
router.get("/edit-agency:id",isAuth, userController.getEditAgency);
router.post("/edit-agency:id",isAuth, userController.postEditAgency);
router.get("/edit-company:id",isAuth, userController.getEditCompany);
router.post("/edit-company:id",isAuth, userController.postEditCompany);
router.get("/edit-employee:id",isAuth, userController.getEditEmployee);
router.post("/edit-employee:id",isAuth, userController.postEditEmployee);
router.get("/edit-insured:id",isAuth, userController.getEditInsured);
router.post("/edit-insured:id",isAuth, userController.postEditInsured);
router.get("/edit-policy:id",isAuth, userController.getEditPolicy);
router.post("/edit-policy:id",isAuth, userController.postEditPolicy);
router.get("/agency",isAuth,  userController.getAgency);
router.post("/agency",isAuth,  userController.postAgency);
router.get("/company",isAuth,  userController.getCompany);
router.post("/company",isAuth,  userController.postCompany);
router.get("/employee",isAuth,  userController.getEmployee);
router.post("/employee",isAuth,  userController.postEmployee);
router.get("/insured",isAuth,  userController.getInsured);
router.post("/insured",isAuth,  userController.postInsured);
router.get("/policy-casco",isAuth,  userController.getPolicyCasco);
router.post("/policy-casco",isAuth,  userController.postPolicyCasco);
router.get("/policy-traffic",isAuth,  userController.getPolicyTraffic);
router.post("/policy-traffic",isAuth,  userController.postPolicyTraffic);
router.get("/policy-dask",isAuth,  userController.getPolicyDask);
router.post("/policy-dask",isAuth,  userController.postPolicyDask);
router.get("/policy-property",isAuth,  userController.getPolicyProperty);
router.post("/policy-property",isAuth,  userController.postPolicyProperty);
router.get("/policy-health",isAuth,  userController.getPolicyHealth);
router.post("/policy-health",isAuth,  userController.postPolicyHealth);
router.get("/policy-other",isAuth,  userController.getPolicyOther);
router.post("/policy-other",isAuth,  userController.postPolicyOther);
router.get("/report-income",isAuth,  userController.getReportIncome);
router.get("/report-expense",isAuth,  userController.getReportExpense);
router.get("/report-profit",isAuth,  userController.getReportProfit);
router.get("/report-company",isAuth,  userController.getReportCompany);
router.get("/report-salary",isAuth,  userController.getReportSalary);
router.get("/report-insured",isAuth,  userController.getReportInsured);
router.get("/report-transaction",isAuth, userController.getReportTransactions);
router.get("/users",isAuth, userController.getUsers);
router.post("/users",isAuth,  userController.postUsers);
router.get("/edit-user:id",isAuth,  userController.getEditUsers);
router.post("/edit-user:id",isAuth,  userController.postEditUsers);
router.get("/profile",isAuth,  userController.getProfile);
router.post("/profile",isAuth,  userController.postProfile);
router.get("/faq",isAuth,  userController.getFaq);
router.get("/restricted",isAuth,  userController.getRestricted);
router.get("/404",isAuth,  userController.get404);
router.get("/signout",isAuth,  userController.getSignOut);


module.exports = router;
