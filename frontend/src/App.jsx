import React from "react";
import ReactDom from 'react-dom';
import HomePage from "./pages/home/homePage";
import "bootstrap/dist/css/bootstrap.min.css"
import LoginPage from "./pages/loginRegister/login";
import SignUp from "./pages/loginRegister/signUp";
import DashBoard from "./pages/dashborad/DashBorad.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter,Routes,Route,NavLink,Link } from "react-router-dom";
import AddProduct from "./pages/product/AddProduct";
import AddCategory from "./pages/Category/AddCategory.jsx";
import AddSupplier from "./pages/supplier/AddSupplier.jsx";
import AddCustomer from "./pages/customer/AddCustomer.jsx";
import AddSale from "./pages/sales/AddSales.jsx";

import Footer from "./component/layout/footer.jsx";
import FeatureSection from "./pages/home/FeatureSection.jsx";
import ReviewSection from "./pages/home/reviewSection.jsx";
import HeroSection from "./pages/home/heroSection.jsx";
import AboutSection from "./pages/home/aboutSection.jsx";
import UserManage from "./pages/userManage.jsx";
import AddPurchase from "./pages/Purchase.jsx";

import Dashboard from "./pages/dashborad/DashBorad.jsx";

import PurchaseManagement from "./pages/purchase/PurchaseManagement.jsx";

export default class App extends React.Component{
  render(){
    
    return<>
   
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignUp/>}/>

    {/* Dashboard Layout with nested routes */}
    <Route path="/dashboard" element={<DashBoard/>}>      
      {/* Product routes */}
      <Route path="addproduct" element={<AddProduct />} />

      {/* Category routes */}
      <Route path="addcategory" element={<AddCategory/>}/>
      
      {/* Supplier routes */}
      <Route path="addsupplier" element={<AddSupplier/>}/>
      
      {/* Customer routes */}
      <Route path="addcustomer" element={<AddCustomer/>}/>
     
       {/* Purchase */}
        <Route path="purchases" element={<PurchaseManagement />} />

      {/* Sales */}
      <Route path="addsales" element={<AddSale/>}/>
      <Route path="user" element={<UserManage/>}/>
       <Route path="purchases" element={<AddPurchase/>}/>

      {/*  Default dashboard content */}
      <Route index element={<h2>Welcome to Dashboard </h2>}/>
    </Route>

    {/* Static sections */}
    <Route path="/feature" element={<FeatureSection/>}/>
    <Route path="/review" element={<ReviewSection/>}/>
    <Route path="/hero" element={<HeroSection/>}/>
    <Route path="/about" element={<AboutSection/>}/>
    <Route path="/footer" element={<Footer/>}/>
    <Route path="/AddSupplier" element={<AddSupplier/>}/>

   </Routes>
   </BrowserRouter>
    
    </>
  }
}
