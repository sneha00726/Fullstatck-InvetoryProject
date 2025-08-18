import React from "react";
import supplierservice from "../../services/supplierservice";
import '../../styles/productdash.css';
import { Link } from "react-router-dom";
export default class AddSupplier extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      companyname: '',
      address: '',
      gstnumber: '',
      errors: [],
      msg: ''
    };
  }

  sendToServer = () => {
    let promise = supplierservice.saveSupplier(this.state);
    promise
      .then((result) => {
        this.setState({ msg: result.data.message, errors: [] });
      })
      .catch((err) => {
        console.error("Insert failed:", err);
        if (err.response && err.response.data && err.response.data.errors) {
          // Backend validation errors
          this.setState({ errors: err.response.data.errors, msg: "" });
        } else {
          // Generic error
          this.setState({ msg: "Supplier insert failed Something is wrong: " + err.message, errors: [] });
        }
      });
  };

  render() {
    return (
      <>
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
        <div className="container p-5">
          <div className="form-group m-3">
            <input
              type="text"
              name="name"
              value={this.state.name}
              placeholder="Enter the name"
              onChange={(e) => this.setState({ name: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group m-3">
            <input
              type="text"
              name="email"
              value={this.state.email}
              placeholder="Enter the email"
              onChange={(e) => this.setState({ email: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group m-3">
            <input
              type="tel"
              name="phone"
              value={this.state.phone}
              placeholder="Enter the Phone"
              onChange={(e) => this.setState({ phone: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group m-3">
            <input
              type="text"
              name="companyname"
              value={this.state.companyname}
              placeholder="Enter the Company name"
              onChange={(e) => this.setState({ companyname: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group m-3">
            <input
              type="text"
              name="address"
              value={this.state.address}
              placeholder="Enter the Address"
              onChange={(e) => this.setState({ address: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group m-3">
            <input
              type="text"
              name="gstnumber"
              value={this.state.gstnumber}
              placeholder="Enter the GST Number"
              onChange={(e) => this.setState({ gstnumber: e.target.value })}
              className="form-control"
            />
          </div>

          <div>
            <input
              type="button"
              name="s"
              value="Add new Supplier"
              className="form-control btn btn-primary"
              onClick={this.sendToServer}
            />
          </div>

          <div className="form-group m-3">
            {this.state.errors.length > 0 && (
              <ul style={{ color: "red" }}>
                {this.state.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
            {this.state.msg && <p style={{ color: "green" }}>{this.state.msg}</p>}
          </div>
        </div>
      </>
    );
  }
}
