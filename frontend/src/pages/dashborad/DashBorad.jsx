import React from "react";
import { Link, Outlet } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/login.register";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/dashboard.css";

export default class DashBoard extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      userRole: user?.role || "user",
      userName: user?.id || "Guest",
      sidebarCollapsed: false
    };
  }

  handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  toggleSidebar = () => {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  };

  render() {
    const { userRole, userName, sidebarCollapsed } = this.state;

    return (
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div
          className={`bg-dark text-white p-3 d-flex flex-column flex-shrink-0 ${
            sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
          }`}
          style={{ width: sidebarCollapsed ? "70px" : "220px", transition: "0.3s" }}
        >
          <h4 className="text-center mb-4">{sidebarCollapsed ? "INV" : "Inventory"}</h4>
          <ul className="nav nav-pills flex-column gap-2">
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-light w-100 text-start" to="addproduct">
                {sidebarCollapsed ? "P" : "Products"}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-light w-100 text-start" to="addcategory">
                {sidebarCollapsed ? "C" : "Category"}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-light w-100 text-start" to="addcustomer">
                {sidebarCollapsed ? "CU" : "Customer"}
              </Link>
            </li>
            {userRole === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light w-100 text-start" to="addsupplier">
                    {sidebarCollapsed ? "S" : "Suppliers"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light w-100 text-start" to="purchases">
                    {sidebarCollapsed ? "PU" : "Purchases"}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light w-100 text-start" to="manageusers">
                    {sidebarCollapsed ? "MU" : "Manage Users"}
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-light w-100 text-start" to="addsales">
                {sidebarCollapsed ? "SA" : "Sales"}
              </Link>
            </li>
          </ul>

          <div className="mt-auto text-center">
            <button
              className="btn btn-sm btn-secondary mb-2"
              onClick={this.toggleSidebar}
            >
              {sidebarCollapsed ? "Expand" : "Collapse"}
            </button>
            <button className="btn btn-sm btn-danger" onClick={this.handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>
              Welcome {userRole === "admin" ? "Admin" : "User"} ({userName})
            </h5>
          </div>
          <Outlet /> {/* nested route content */}
        </div>
      </div>
    );
  }
}
