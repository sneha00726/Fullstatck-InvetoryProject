import React from "react";
import { Link, Outlet } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/login.register";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBox, FaList, FaUser, FaTruck, FaShoppingCart, FaUsers, FaMoneyBill, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/dashboard.css";

export default class DashBoard extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      userRole: user?.role || "user",
      userName: user?.id || "Guest",
      sidebarCollapsed: false,
    };
  }

  handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  toggleSidebar = () => {
    this.setState((prev) => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  render() {
    const { userRole, userName, sidebarCollapsed } = this.state;
    const sidebarWidth = sidebarCollapsed ? 70 : 220;

    // Menu items with icons
    const menuItems = [
      { name: "Products", icon: <FaBox />, path: "addproduct" },
      { name: "Category", icon: <FaList />, path: "addcategory" },
      { name: "Customer", icon: <FaUser />, path: "addcustomer" },
    ];

    if (userRole === "admin") {
      menuItems.push(
        { name: "Suppliers", icon: <FaTruck />, path: "addsupplier" },
        { name: "Purchases", icon: <FaMoneyBill />, path: "purchases" },
        { name: "Manage Users", icon: <FaUsers />, path: "user" }
      );
    }

    menuItems.push({ name: "Sales", icon: <FaShoppingCart />, path: "addsales" });

    return (
      <div className="dashboard">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`} style={{ width: sidebarWidth }}>
          <h4 className="text-center mb-4">{sidebarCollapsed ? "INV" : "Inventory"}</h4>

          <ul className="nav flex-column gap-2">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.name}>
                <Link className="nav-link" to={item.path}>
                  <span className="icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="text">{item.name}</span>}
                  {sidebarCollapsed && <span className="tooltip">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto text-center sidebar-buttons">
            <button className="btn btn-sm btn-secondary toggle-btn" onClick={this.toggleSidebar}>
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />} {/* Icon only when collapsed/expanded */}
            </button>
            <button className="btn btn-sm btn-danger logout-btn" onClick={this.handleLogout}>
              {sidebarCollapsed ? <FaSignOutAlt /> : "Logout"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ marginLeft: sidebarWidth }}>
          <div className="topbar">
            <h5>
              Welcome {userRole === "admin" ? "Admin" : "User"} ({userName})
            </h5>
          </div>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}
