import React from "react";
import ReactDom from 'react-dom';
import HomePage from "./pages/home/homePage";
import "bootstrap/dist/css/bootstrap.min.css"
import LoginPage from "./pages/loginRegister/login";
import SignUp from "./pages/loginRegister/signUp";
import DashBoard from "./pages/dashborad/DashBorad.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import withRouterParams from "./pages/product/withRouterParams.jsx";
import { BrowserRouter,Routes,Route,NavLink,Link } from "react-router-dom";
import AddProduct from "./pages/product/AddProduct";
import ViewProduct from "./pages/product/viewProduct";
import DelProd from "./pages/product/DelProd";
import AddCategory from "./pages/Category/AddCategory.jsx";
import ViewCategory from "./pages/Category/viewCategory.jsx";
import AddSupplier from "./pages/supplier/AddSupplier.jsx";
import ViewSupplier from "./pages/supplier/VIewSupplier.jsx";
import Product from "./pages/dashborad/product.jsx";

import PurchaseManagement from "./pages/purchase/PurchaseManagement.jsx";

export default class App extends React.Component{
  render(){
    let ProdWithParams=withRouterParams(DelProd);
   
    return<>
   
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignUp/>}/>

    <Route path="/dashboard" element={<DashBoard/>}/>
    <Route path="/product" element={<Product/>}/>

    <Route path="/AddProduct" element={<AddProduct/>}/>
    <Route path="/viewProduct" element={<ViewProduct/>}/>
    <Route path="/delprod/:pid" element={<ProdWithParams/>}/>  {/* run time parameter pid comes fomr database */}

    <Route path="/AddCategory" element={<AddCategory/>}/>
    <Route path="/viewCategory" element={<ViewCategory/>}/>


      <Route path="/AddSupplier" element={<AddSupplier/>}/>
      <Route path="/viewsupplier" element={<ViewSupplier/>}/>

      <Route path="/purchases" element={<PurchaseManagement />} />

   </Routes>
   </BrowserRouter>
    
    </>
  }
}
