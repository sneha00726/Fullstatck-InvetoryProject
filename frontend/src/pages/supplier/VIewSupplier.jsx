import React from "react";
import ReactDOm from 'react-dom';
import supplierservice from "../../services/supplierservice";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
export default class ViewSupplier extends React.Component{
    constructor(props){
        super(props);
        this.state={
            supplier:[]
        }
    }
    render(){
        return<>
         <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid header">
            <a className="navbar-brand" href="#home">Supplier</a>

            <div className="collapse navbar-collapse option" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/AddSupplier">Add supplier</Link>
                </li>
                <li className="nav-item">
                   <Link to="/viewsupplier">View supplier</Link>
                </li>
               <li className="nav-item">
                   <Link to="/dashboard"> DashBoard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container p-5 table-responsive table-warning"> 
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>SRNO</th>
                        <th>name</th>
                        <th>email</th>
                        <th>phone</th>
                        <th>Company_name</th>
                        <th>Address</th>   
                        <th>GstNumber</th>
                        <th>DELETE</th>
                        <th>UPDATE</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.supplier.map((sup,index)=>
                        (<tr  key={sup.sid}>
                        <td>{sup.sid}</td>
                        <td>{sup.name}</td>
                        <td>{sup.email}</td>
                        <td>{sup.phone}</td>
                        <td>{sup.companyname}</td>
                        <td>{sup.address}</td>
                        <td>{sup.gstnumber}</td>
                        <td><NavLink className={"btn btn-danger btn-sm"} >DELETE</NavLink> </td>
                        <td><NavLink className={"btn btn-success btn-sm"} >UPDATE</NavLink></td>
                            </tr>))
                    }
                    <tr></tr>
                </tbody>
            </table>
        </div>
        
        </>
    }
     componentDidMount()
        {
          let promise=supplierservice.getSupplier();
          promise.then((response)=>
          {
           this.setState({ supplier: response.data }); // use response
          //console.log(response.data);
            //console.log(response.data);//array
          }).catch((err)=>
          {
            console.log(err);
    
          })
        }
}