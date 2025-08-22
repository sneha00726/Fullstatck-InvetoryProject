import React from "react";
import { Link, Outlet } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/login.register";
import "../../styles/dashboard.css";

export default class DashBoard extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      userRole: user?.role || "user",
      userName: user?.id || "Guest"
    };
  }

  handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  render() {
    const { userRole, userName } = this.state;
    return (
      <div className="dashboard-layout">
        <div className="topbar d-flex justify-content-between align-items-center px-4 py-2 bg-dark text-white">
          <h5>Welcome {userRole === "admin" ? "Admin" : "User"} ({userName})</h5>
          <button className="btn btn-danger btn-sm" onClick={this.handleLogout}>Logout</button>
        </div>

        <div className="dashboard-body d-flex">
          <div className="sidebar">
            <h3>Inventory</h3>
            <ul>
              <li><Link to="addproduct">Products</Link></li>
              <li><Link to="addcategory">Category</Link></li>
              <li><Link to="addcustomer">Customer</Link></li>
              {userRole === "admin" && <li><Link to="suppliers">Suppliers</Link></li>}
              {userRole === "admin" && <li><Link to="purchases">Purchases</Link></li>}
              <li><Link to="addsales">Sales</Link></li>
              {userRole === "admin" && <li><Link to="manageusers">Manage Users</Link></li>}
            </ul>
          </div>
          <div className="p-4 flex-grow-1">
            <Outlet /> {/* nested route content */}
          </div>
        </div>
      </div>
    );
  }
}
