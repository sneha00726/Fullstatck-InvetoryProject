import React from "react";
import CustService from "../../services/customerService";
import { getCurrentUser } from "../../services/login.register";
import "../../styles/productdash.css"; // reuse same CSS

export default class CustomerDashboard extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      name: "",
      email: "",
      phone_no: "",
      company_name: "",
      address: "",
      gstNumber: "",
      msg: "",
      customers: [],
      currentPage: 1,
      customersPerPage: 10,
      showForm: false,
      search: "",
      userRole: user?.role || "user", // ✅ both roles can access
    };
  }

  componentDidMount() {
    this.loadCustomers();
  }

  loadCustomers = () => {
    CustService.viewCustomer()
      .then((res) => this.setState({ customers: res.data }))
      .catch((err) => console.error(err));
  };

  handleSearch = (e) => {
    const searchValue = e.target.value;
    this.setState({ search: searchValue });

    if (!searchValue.trim()) {
      this.loadCustomers();
      return;
    }

    CustService.searchCustomer(searchValue)
      .then((res) => this.setState({ customers: res.data, currentPage: 1 }))
      .catch(() => this.setState({ customers: [] }));
  };

  sendCustomerToServer = () => {
    const { id, name, email, phone_no, company_name, address, gstNumber } = this.state;

    if (id) {
      // update existing customer
      CustService.updateCustomer(id, { name, email, phone_no, company_name, address, gstNumber })
        .then((result) => {
          this.setState({ msg: "Customer updated successfully", showForm: false, id: "" });
          this.loadCustomers();
        })
        .catch(() => this.setState({ msg: "Customer update failed" }));
    } else {
      // add new customer
      CustService.saveCustomer({ name, email, phone_no, company_name, address, gstNumber })
        .then((result) => {
          this.setState({ msg: result.data.message, showForm: false });
          this.loadCustomers();
        })
        .catch(() => this.setState({ msg: "Customer insert failed" }));
    }
  };

  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  render() {
    const {
      name, email, phone_no, company_name, address, gstNumber, msg,
      customers, currentPage, customersPerPage, showForm, search
    } = this.state;

    const indexOfLast = currentPage * customersPerPage;
    const indexOfFirst = indexOfLast - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    return (
      <div className="container p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search customer..."
            value={search}
            onChange={this.handleSearch}
          />
          <button
            className="btn btn-primary ms-3"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            {showForm ? "View Customers" : "Add Customer"}
          </button>
        </div>

        {/* Add/Update Customer Form */}
        {showForm && (
          <div className="card p-4 mb-4">
            <h4>{this.state.id ? "Update Customer" : "Add Customer"}</h4>
            <div className="form-group m-2">
              <input type="text" value={name} placeholder="Enter name"
                     className="form-control" onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="email" value={email} placeholder="Enter email"
                     className="form-control" onChange={(e) => this.setState({ email: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="text" value={phone_no} placeholder="Enter phone"
                     className="form-control" onChange={(e) => this.setState({ phone_no: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="text" value={company_name} placeholder="Enter company name"
                     className="form-control" onChange={(e) => this.setState({ company_name: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="text" value={address} placeholder="Enter address"
                     className="form-control" onChange={(e) => this.setState({ address: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="text" value={gstNumber} placeholder="Enter GST number"
                     className="form-control" onChange={(e) => this.setState({ gstNumber: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <button className="btn btn-success w-100" onClick={this.sendCustomerToServer}>
                {this.state.id ? "Update Customer" : "Save Customer"}
              </button>
            </div>
            <div className="text-success">{msg}</div>
          </div>
        )}

        {/* Customer List */}
        <h4>Customer List</h4>
        <table className="table table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
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
            {currentCustomers.length > 0 ? currentCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone_no}</td>
                <td>{cust.company_name}</td>
                <td>{cust.address}</td>
                <td>{cust.gstNumber}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2"
                          onClick={() => this.setState({ showForm: true, ...cust })}>Update</button>
                  <button className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this customer?")) {
                              CustService.delCustomer(cust.id).then(() => this.loadCustomers());
                            }
                          }}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-danger fw-bold">🚫 No customers found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => this.paginate(currentPage - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => this.paginate(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => this.paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
