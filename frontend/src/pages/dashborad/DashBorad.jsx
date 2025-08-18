import React from "react";
import ReactDom from 'react-dom';
//import Product from "./product";
import { Link } from "react-router-dom";
import '../../styles/dashboard.css';
import Product from "./product";
export default class DashBoard extends React.Component{
    render()
    {
        return <>
       <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Inventory</h3>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/AddCategory">Categories</Link></li>
            <li><Link to="/AddProduct">Product</Link></li>
            <li><Link to="/AddSupplier">Supplier</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/suppliers">Suppliers</Link></li>
            <li><Link to="/sales">Sales</Link></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main">
          <div className="topbar">
            <h2>Dashboard</h2>
          </div>
          
        </div>
      </div>
        
        </>
    }
}