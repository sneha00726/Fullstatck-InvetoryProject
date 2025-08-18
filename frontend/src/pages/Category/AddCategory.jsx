import React from "react";
import CategoryService from "../../services/CategoryService";
import { Link } from "react-router-dom";
export default class AddCategory extends React.Component {
  constructor() {
    super();
    this.state = {
      cname: "",
      msg:''
    };
  }

   sendCatToserver = () => {
    const categoryData = { cname: this.state.cname };
   let promise=CategoryService.saveCategory(categoryData);
     promise.then((result) => {
         this.setState({msg:result.data.message});
      })
      .catch((err) => {
        console.error("Insert failed:", err);
        this.setState({ msg: "Failed to add category. Please try again." });
      });
      
  };
  render() {
    return (
      <>
       <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid header">
            <a className="navbar-brand" href="#home">Category</a>

            <div className="collapse navbar-collapse option" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/AddCategory">Add category</Link>
                </li>
                <li className="nav-item">
                   <Link to="/viewCategory">View category</Link>
                </li>
               <li className="nav-item">
                   <Link to="/dashboard"> DashBoard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container p-5 mt-5">
          <div className="form-group m-3">
            <input
              type="text"
              name="cname"
              value={this.state.cname}
              placeholder="Enter category name"
              className="form-control"
              onChange={(e) => this.setState({ cname: e.target.value })}
            />
          </div>

          <div>
            <input
              type="button"
              name="s"
              value="Add new Category"
              className="form-control"
              onClick={this.sendCatToserver}
            />
          </div>

          <div className="form-group m-3">
            <label>{this.state.msg}</label>
          </div>
        </div>
      </>
    );
  }
}
