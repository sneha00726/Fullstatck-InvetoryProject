import React from "react";
import ReactDom from 'react-dom';
import AddProduct from "../product/AddProduct";
import { Link } from "react-router-dom";
import '../../styles/productdash.css';
export default class Product extends React.Component{

    render()
    {
        return<>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid header">
            <a className="navbar-brand" href="#home">Product</a>

            <div className="collapse navbar-collapse option" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/AddProduct">Add Product</Link>
                </li>
                <li className="nav-item">
                   <Link to="/viewProduct">View Product</Link>
                </li>
               
              </ul>
            </div>
          </div>
        </nav>
      </>
        
    }
}