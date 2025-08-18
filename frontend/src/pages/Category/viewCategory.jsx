import React from "react";
import ReactDom from 'react-dom';
import { NavLink } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import { Link } from "react-router-dom";
export default class ViewCategory extends React.Component{
  constructor(props){
    super(props);
    this.state={
      category:[],
      message:" "
    }
  }
  handleDelete = (cid) => {
    // show confirm alert
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      CategoryService.delCat(cid)
        .then((response) => {
          this.setState({ message: response.data.message });

          // filter deleted product from state so UI updates immediately
          this.setState((prevState) => ({
            category: prevState.category.filter((p) => p.cid !== cid)
          }));

          alert("category deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
          alert("Some problem occurred while deleting.");
        });
    }
  };
    render()
    {
        return<>
         <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid header">
            <a className="navbar-brand" href="#home">Category</a>

            <div className="collapse navbar-collapse option" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/AddCategory">Add Category</Link>
                </li>
                <li className="nav-item">
                   <Link to="/viewCategory">View Category</Link>
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
                <th>DELETE</th>
                <th>UPDATE</th>
                </tr>
                </thead>

                <tbody>
                {
                  this.state.category.map((cat,index)=>
                  (<tr  key={cat.cid}>
                <td>{cat.cid}</td>
                <td>{cat.cname}</td>
               
               <td> <button
                      className="btn btn-danger btn-sm"
                       onClick={() => this.handleDelete(cat.cid)}>
                    
                      Delete
                    </button></td>
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
      let promise=CategoryService.getCategory();
      promise.then((response)=>
      {
       this.setState({ category: response.data }); // use response
      //console.log(response.data);
        //console.log(response.data);//array
      }).catch((err)=>
      {
        console.log(err);

      })
    }
}

