import React from "react";
import ReactDom from 'react-dom';
import ProductSerivce from "../../services/ProductSerivce";
import CategoryService from "../../services/CategoryService";
import supplierservice from "../../services/supplierservice";

import { Link } from "react-router-dom";
import '../../styles/productdash.css';
export default class AddProduct extends React.Component{
    constructor(){
        super();
        this.state={
            pname:'',
            price:'',
            supplier_id:'',
            cid:'',
            stock:'',
            msg:'',
            categories: [],
            supplier:[]
        }
    }
    componentDidMount() {
    // Load all categories from backend   for dropdown 
    CategoryService.getCategory()
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
       supplierservice.getSupplier()
      .then((res) => {
        this.setState({ supplier: res.data });
      })
      .catch((err) => {
        console.error("Failed to fetch supplier:", err);
      });
  }
    sendProdToserver=()=>
    {
        let promise=ProductSerivce.saveProduct(this.state);
        promise.then((result)=>
        {   
            this.setState({msg:result.data.message});

        }).catch((err) => {
            console.error("Insert failed:", err);
    this.setState({ msg: "Product insert failed: " + err.message });
            });
    }
    render()
    {
        return <>
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
               <li className="nav-item">
                   <Link to="/dashboard"> DashBoard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container p-5">
            <div className="form-group m-3">
                <input type="text" name="pname" value={this.state.pname} placeholder="enter the product name" className="form-control"
                onChange={(e)=>this.setState({pname:e.target.value})} />
            </div>
             <div className="form-group m-3">
                <input type="text" name="price" value={this.state.price} placeholder="enter the product price" className="form-control" 
                onChange={(e)=>this.setState({price:e.target.value})}/>
            </div>
           <div className="form-group m-3">
           <select
            className="form-control"
            value={this.state.supplier_id}
            onChange={(e) => this.setState({ supplier_id: e.target.value })}>
            <option value="">-- Select Supplier --</option>
            {this.state.supplier.map((sup) => (
              <option key={sup.sid} value={sup.sid}>
                {sup.name}
              </option>
            ))}
          </select>
                    </div>
           <div className="form-group m-3">
            <select
              className="form-control"
              value={this.state.cid}
              onChange={(e) => this.setState({ cid: e.target.value })}>
              <option value="">-- Select Category --</option>
              {this.state.categories.map((cat) => (
                <option key={cat.cid} value={cat.cid}>
                  {cat.cname}
                </option>
              ))}
            </select>
          </div>

            <div className="form-group m-3" >
                <input type="text" name="stock" value={this.state.stock} placeholder="enter the product stock" className="form-control" 
                onChange={(e)=>this.setState({stock:e.target.value})}/>
            </div>
            <div>
                <input type='button' name="s" value="Add new Product" className="form-control" onClick={this.sendProdToserver} />
            </div>
            <div className="form-group m-3" >
                <label>{this.state.msg}</label>
            </div>

        </div>
        
        </>
    }
}