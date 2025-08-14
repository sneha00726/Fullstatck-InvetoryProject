import React from "react";
import ReactDom from 'react-dom';
import HomePage from "./pages/home/homePage";
import "bootstrap/dist/css/bootstrap.min.css"
import LoginPage from "./pages/loginRegister/login";
import SignUp from "./pages/loginRegister/signUp";
import { BrowserRouter,Routes,Route,NavLink,Link } from "react-router-dom";
export default class App extends React.Component{
  render(){
    return<>
   
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/signup" element={<SignUp/>}/>
   </Routes>
   </BrowserRouter>
    
    </>
  }
}
