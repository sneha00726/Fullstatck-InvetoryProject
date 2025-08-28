import React from "react";
import SupplierService from "../../services/supplierservice";
import { getCurrentUser, logoutUser } from "../../services/login.register";
import "../../styles/productdash.css"; // reuse same CSS

export default class AddSupplier extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      sid: "",
      name: "",
      email: "",
      phone: "",
      companyname: "",
      address: "",
      gstnumber: "",
      msg: [],
      suppliers: [],
      currentPage: 1,
      suppliersPerPage: 10,
      showForm: false,
      search: "",
      userRole: user?.role || "user",
      isLoggedIn: !!user,
    };
  }

  componentDidMount() {
    if (this.state.isLoggedIn && this.state.userRole === "admin") {
      this.loadSuppliers();
    }
  }

  handleUnauthorized = () => {
    logoutUser();
    this.setState({
      isLoggedIn: false,
      msg: ["Session expired. Please log in again."],
    });
  };

  loadSuppliers = () => {
    SupplierService.getSupplier()
      .then((res) =>
        this.setState({ suppliers: res.data.suppliers || [], msg: [] })
      )
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.message.includes("No token")) {
          this.handleUnauthorized();
        } else {
          this.setState({ msg: ["Unable to load suppliers."] });
        }
      });
  };

  handleSearch = (e) => {
    const searchValue = e.target.value;
    this.setState({ search: searchValue });

    if (!searchValue.trim()) {
      this.loadSuppliers();
      return;
    }

    SupplierService.searchSupplier(searchValue)
      .then((res) =>
        this.setState({
          suppliers: res.data.suppliers || [],
          currentPage: 1,
          msg: [],
        })
      )
      .catch((err) => {
        console.error(err);
        this.setState({ suppliers: [], msg: ["No suppliers found."] });
      });
  };

  sendSupplierToServer = () => {
    const { sid, name, email, phone, companyname, address, gstnumber } =
      this.state;

    if (!name || !email || !phone) {
      this.setState({ msg: ["Name, Email, and Phone are required"] });
      return;
    }

    const supplierData = {
      name,
      email,
      phone,
      companyname,
      address,
      gstnumber,
    };

    const action = sid
      ? SupplierService.updateSupplier(sid, supplierData)
      : SupplierService.saveSupplier(supplierData);

    action
      .then((res) => {
        const msg = sid
          ? ["✅ Supplier updated successfully"]
          : [res.data.message || "✅ Supplier added successfully"];

        this.setState({
          msg,
          showForm: false,
          sid: "",
          name: "",
          email: "",
          phone: "",
          companyname: "",
          address: "",
          gstnumber: "",
        });

        this.loadSuppliers();
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.message.includes("No token")) {
          this.handleUnauthorized();
        } else {
          const serverData = err.response?.data;
          this.setState({
            msg: serverData?.errors || [serverData?.message || "❌ Action failed"],
          });
        }
      });
  };

  deleteSupplier = (sid) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      SupplierService.delSupplier(sid)
        .then(() => {
          this.setState({ msg: ["🗑️ Supplier deleted successfully"] });
          this.loadSuppliers();
        })
        .catch((err) => {
          console.error(err);
          if (err.response?.status === 401 || err.message.includes("No token")) {
            this.handleUnauthorized();
          } else {
            this.setState({
              msg: [err.response?.data?.message || "❌ Supplier deletion failed"],
            });
          }
        });
    }
  };

  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  render() {
    const {
      sid,
      name,
      email,
      phone,
      companyname,
      address,
      gstnumber,
      msg,
      suppliers,
      currentPage,
      suppliersPerPage,
      showForm,
      search,
      userRole,
      isLoggedIn,
    } = this.state;

    if (!isLoggedIn) {
      return (
        <div className="container p-4">
          <h4 className="text-danger">You are not logged in.</h4>
        </div>
      );
    }

    if (userRole !== "admin") {
      return (
        <div className="container p-4">
          <h4 className="text-danger">Access Denied! Admin only.</h4>
        </div>
      );
    }

    const indexOfLast = currentPage * suppliersPerPage;
    const indexOfFirst = indexOfLast - suppliersPerPage;
    const currentSuppliers = suppliers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(suppliers.length / suppliersPerPage);

    return (
      <div className="container p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search supplier..."
            value={search}
            onChange={this.handleSearch}
          />
          <button
            className="btn btn-primary ms-3"
            onClick={() =>
              this.setState({
                showForm: !showForm,
                sid: "",
                name: "",
                email: "",
                phone: "",
                companyname: "",
                address: "",
                gstnumber: "",
                msg: [],
              })
            }
          >
            {showForm ? "View Suppliers" : "Add Supplier"}
          </button>
        </div>

        {showForm && (
          <div className="card p-4 mb-4">
            <h4>{sid ? "Update Supplier" : "Add Supplier"}</h4>
            {["name", "email", "phone", "companyname", "address", "gstnumber"].map(
              (field) => (
                <div className="form-group m-2" key={field}>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={this.state[field]}
                    placeholder={`Enter ${field}`}
                    className="form-control"
                    onChange={(e) =>
                      this.setState({ [field]: e.target.value })
                    }
                  />
                </div>
              )
            )}
            <button
              className="btn btn-success w-100"
              onClick={this.sendSupplierToServer}
            >
              {sid ? "Update Supplier" : "Save Supplier"}
            </button>

            {/* Messages below the button */}
            {Array.isArray(msg) && msg.length > 0 && (
              <ul
                className={`alert mt-2 ${
                  msg[0].startsWith("✅") ? "alert-success" : "alert-danger"
                }`}
              >
                {msg.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <h4>Supplier List</h4>
        <table className="table table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>SID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Address</th>
              <th>GST</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSuppliers.length > 0 ? (
              currentSuppliers.map((sup) => (
                <tr key={sup.sid}>
                  <td>{sup.sid}</td>
                  <td>{sup.name}</td>
                  <td>{sup.email}</td>
                  <td>{sup.phone}</td>
                  <td>{sup.companyname}</td>
                  <td>{sup.address}</td>
                  <td>{sup.gstnumber}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => this.setState({ showForm: true, ...sup })}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => this.deleteSupplier(sup.sid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-danger fw-bold">
                  🚫 No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => this.paginate(currentPage - 1)}
              >
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => this.paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => this.paginate(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
