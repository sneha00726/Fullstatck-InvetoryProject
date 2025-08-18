import React from "react";
import ReactDom from 'react-dom';
import { NavLink } from "react-router-dom";
import ProductSerivce from "../../services/ProductSerivce";
import { Link } from "react-router-dom";
export default class ViewProduct extends React.Component{
  constructor(props){
    super(props);
    this.state={
      products:[]
      //message:" "
    }
  }
  
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
                <li className="nav-item">
                                   <Link to="/dashboard"> DashBoard</Link>
                                </li>
              </ul>
            </div>
          </div>
        </nav>
      <div className="container p-5">
        
        <table className="table table-striped">
                 <thead>
                    <tr >
                <th>SRNO</th>
                <th>Name</th>
                <th>Price</th>
                <th>supplier_id</th>
                <th>Category_id</th>
                <th>stock</th>
                <th>DELETE</th>
                <th>UPDATE</th>
                </tr>
                </thead>

                <tbody>
                {
                  this.state.products.map((prod,index)=>
                  (<tr  key={prod.pid}>
                <td>{prod.pid}</td>
                <td>{prod.pname}</td>
               <td>{prod.price}</td>
               <td>{prod.supplier_id}</td>
               <td>{prod.cid}</td>
               <td>{prod.stock}</td>
               <td><NavLink to={`/delprod/${prod.pid}`}>DELETE</NavLink> </td>
               <td><NavLink>UPDATE</NavLink></td>
                </tr>))
                }
                </tbody>
                
          
        </table>
      </div>
        
        </>
    }
    componentDidMount()
    {
      let promise=ProductSerivce.getProdDetails();
      promise.then((response)=>
      {
       this.setState({ products: response.data }); // use response
      //console.log(response.data);
        //console.log(response.data);//array
      }).catch((err)=>
      {
        console.log(err);

      })
    }
}

/**
 * {this.state.message && (
            <div className="alert alert-success">{this.state.message}</div>
          )}
 *  handleDelete = (pid) => {
    // show confirm alert
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      ProductSerivce.delProd(pid)
        .then((response) => {
          this.setState({ message: response.data.message });

          // filter deleted product from state so UI updates immediately
          this.setState((prevState) => ({
            products: prevState.products.filter((p) => p.pid !== pid)
          }));

          alert("Product deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
          alert("Some problem occurred while deleting.");
        });
    }
  };
  
  <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.handleDelete(prod.pid)}
                    >
                      Delete
                    </button>
  */