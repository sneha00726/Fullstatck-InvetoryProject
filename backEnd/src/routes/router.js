let express=require("express");

let ctrl=require("../controllers/register_loginctrl.js");
let cat_ctrl=require("../controllers/Categoryctrl.js");
let pctrl=require("../controllers/productcontroller.js");
let sctrl=require("../controllers/supplierctrl.js");
let cust_ctrl=require("../controllers/customerctrl.js");
let purctrl=require("../controllers/purchasectrl.js");
let salesctrl=require("../controllers/salesCtrl.js");
let dash=require("../controllers/dashboard.js");
let userctr=require("../controllers/userctrl.js");
//const dashboardController = require("../controllers/dashboard.js");
let router = express.Router();

let { VerifyToken } = require("../middleware/authmiddleware.js");  
let authorizeRoles  = require("../middleware/authorized.js");

// user api (public)
router.get("/", ctrl.HomeLoginPage);
router.post("/api/register", ctrl.RegisterApi);
router.post("/api/login", ctrl.LoginPage);
//router.get("/dashboard",dash.dashboard);

// category api 
router.post("/api/categories/add", VerifyToken, authorizeRoles("admin"), cat_ctrl.createCategory);
router.get("/api/categories/view", VerifyToken, authorizeRoles("admin","user"), cat_ctrl.getAllCategory);
router.get("/api/categories/:id", VerifyToken, authorizeRoles("admin"),  cat_ctrl.getCategoryById);
router.put("/api/categories/update/:id",  VerifyToken, authorizeRoles("admin"), cat_ctrl.UpdateCategory);
router.delete("/api/categories/delete/:id", VerifyToken, authorizeRoles("admin"),cat_ctrl.DeleteCategory);
router.get("/api/categories/search/:name", VerifyToken, authorizeRoles("admin","user"),cat_ctrl.searchCategory);



//product
router.post("/api/products/add", VerifyToken, authorizeRoles("admin"), pctrl.addProduct);
router.get("/api/products/view", VerifyToken, authorizeRoles("admin","user"), pctrl.viewProducts);
router.get("/api/products/:id", VerifyToken, authorizeRoles("admin"), pctrl.getProdById);
router.put("/api/products/update/:id", VerifyToken, authorizeRoles("admin","user"), pctrl.updateProdById);
router.delete("/api/products/delete/:id", VerifyToken, authorizeRoles("admin"), pctrl.deleteProdById);
router.get("/api/products/search/:name", VerifyToken, authorizeRoles("admin","user"), pctrl.searchProdByName);

//supplier
router.post("/api/suppliers/add", VerifyToken, authorizeRoles("admin"), sctrl.addSupplier);
router.get("/api/suppliers/view", VerifyToken, authorizeRoles("admin"), sctrl.viewSuppliers);
router.get("/api/suppliers/:id", VerifyToken, authorizeRoles("admin"), sctrl.getSupplierById);
router.put("/api/suppliers/update/:id", VerifyToken, authorizeRoles("admin"), sctrl.updateSupplierById);
router.delete("/api/suppliers/delete/:id", VerifyToken, authorizeRoles("admin"), sctrl.deleteSupplierById);
router.get("/api/suppliers/search/:name", VerifyToken, authorizeRoles("admin"),sctrl.searchSupplier);

//customer
router.post("/api/customer/add", VerifyToken, authorizeRoles("admin","user"), cust_ctrl.AddCustomer);
router.get("/api/customer/view", VerifyToken, authorizeRoles("admin","user"),cust_ctrl.viewAllCustomer);
router.get("/api/customer/:id", VerifyToken, authorizeRoles("admin","user"),cust_ctrl.customerGetById);
router.put("/api/customer/updateBy/:id", VerifyToken, authorizeRoles("admin","user"),cust_ctrl.UpdateCustomer);
router.delete("/api/customer/delete/:id", VerifyToken, authorizeRoles("admin","user"),cust_ctrl.CustomerDelete);
router.get("/api/customer/search/:name", VerifyToken, authorizeRoles("admin","user"),cust_ctrl.CustSearch);

//purchase
router.post("/api/purchases/add", VerifyToken, authorizeRoles("admin"),purctrl.addPurchase);
router.get("/api/purchases/view", VerifyToken, authorizeRoles("admin"),purctrl.viewPurchases);
router.get("/api/purchases/:id", VerifyToken, authorizeRoles("admin"),purctrl.getPurchaseById);
router.put("/api/purchases/update/:id", VerifyToken, authorizeRoles("admin"),purctrl.updatePurchaseById);
router.delete("/api/purchases/delete/:id", VerifyToken, authorizeRoles("admin"),purctrl.deletePurchaseById);
router.get("/api/purchases/search/:name", VerifyToken, authorizeRoles("admin"),purctrl.purchasesearch);

//salesa
router.post("/api/sales/add", VerifyToken, authorizeRoles("admin","user"),salesctrl.addSale);
router.get("/api/sales/view",VerifyToken, authorizeRoles("admin","user"),salesctrl.ViewAllSales);
router.get("/api/sales/:id", VerifyToken, authorizeRoles("admin","user"),salesctrl.GetbyIDSales);
router.put("/api/sales/update/:id", VerifyToken, authorizeRoles("admin","user"),salesctrl.updateSalesById);
router.delete("/api/sales/delete/:id", VerifyToken, authorizeRoles("admin","user"),salesctrl.deleteSalesById);
router.get("/api/sales/search/:invoice", VerifyToken, authorizeRoles("admin","user"),salesctrl.salesSearch);

router.get("/api/sales/download/:id", VerifyToken, authorizeRoles("admin","user"),salesctrl.downloadInvoice);
//usermange
router.post("/api/users/add", VerifyToken, authorizeRoles("admin"), userctr.addUser);
router.get("/api/users/view", VerifyToken, authorizeRoles("admin"), userctr.viewUsers);
router.get("/api/users/:id", VerifyToken, authorizeRoles("admin"), userctr.getUserById);
router.put("/api/users/update/:id", VerifyToken, authorizeRoles("admin"), userctr.updateUser);
router.delete("/api/users/delete/:id", VerifyToken, authorizeRoles("admin"), userctr.deleteUser);
router.get("/api/users/search/:keyword", VerifyToken, authorizeRoles("admin"), userctr.searchUsers);

/*

router.get("/api/dashboard/total-products", VerifyToken, dashboardController.totalProducts);
router.get("/api/dashboard/total-categories", VerifyToken, dashboardController.totalCategories);
router.get("/api/dashboard/products-per-category", VerifyToken, dashboardController.productsPerCategory);
router.get("/api/dashboard/sales-this-month", VerifyToken, dashboardController.salesThisMonth);
router.get("/api/dashboard/monthly-sales", VerifyToken, dashboardController.monthlySales);
*/
module.exports = router;

