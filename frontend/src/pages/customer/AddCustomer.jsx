import React from "react";
import CustService from "../../services/customerService";
import { getCurrentUser } from "../../services/login.register";
import "../../styles/productdash.css"; // reuse same CSS

export default class AddCustomer extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      id: "",
      name: "",
      email: "",
      phone_no: "",
      company_name: "",
      address: "",
      gstNumber: "",
      errors: {}, // <-- field-specific errors
      customers: [],
      currentPage: 1,
      customersPerPage: 10,
      showForm: false,
      search: "",
      userRole: user?.role || "user",
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

  this.setState({ errors: {} });

  const customerData = { name, email, phone_no, company_name, address, gstNumber };

  const handleError = (err) => {
    const errorData = err.response?.data;
    if (errorData?.errors) {
      const errorsObj = {};
      errorData.errors.forEach((msg) => {
        if (msg.toLowerCase().includes("name")) errorsObj.name = msg;
        else if (msg.toLowerCase().includes("email")) errorsObj.email = msg;
        else if (msg.toLowerCase().includes("phone")) errorsObj.phone_no = msg;
        else if (msg.toLowerCase().includes("company")) errorsObj.company_name = msg;
        else if (msg.toLowerCase().includes("address")) errorsObj.address = msg;
        else if (msg.toLowerCase().includes("gst")) errorsObj.gstNumber = msg;
        else errorsObj.general = msg;
      });
      this.setState({ errors: errorsObj });
    } else {
      this.setState({ errors: { general: errorData?.message || "Customer action failed" } });
    }
  };

  if (id) {
    // Update
    CustService.updateCustomer(id, customerData)
      .then(() => {
        this.setState({ showForm: false, id: "", errors: {} });
        this.loadCustomers();
        window.alert(" Customer updated successfully!");
      })
      .catch(handleError);
  } else {
    // Add
    CustService.saveCustomer(customerData)
      .then(() => {
        this.setState({ showForm: false, errors: {} });
        this.loadCustomers();
        window.alert("Customer added successfully!");
      })
      .catch(handleError);
  }
};


  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  render() {
    const {
      id, name, email, phone_no, company_name, address, gstNumber, errors,
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
            onClick={() => this.setState({ showForm: !showForm, errors: {} })}
          >
            {showForm ? "View Customers" : "Add Customer"}
          </button>
        </div>

        {/* Add/Update Customer Form */}
        {showForm && (
          <div className="card p-4 mb-4">
            <h4>{id ? "Update Customer" : "Add Customer"}</h4>

            {/* Name */}
            <div className="form-group m-2">
              <input
                type="text"
                value={name}
                placeholder="Enter name"
                className="form-control"
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group m-2">
              <input
                type="email"
                value={email}
                placeholder="Enter email"
                className="form-control"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="form-group m-2">
              <input
                type="text"
                value={phone_no}
                placeholder="Enter phone"
                className="form-control"
                onChange={(e) => this.setState({ phone_no: e.target.value })}
              />
              {errors.phone_no && <div className="text-danger">{errors.phone_no}</div>}
            </div>

            {/* Company Name */}
            <div className="form-group m-2">
              <input
                type="text"
                value={company_name}
                placeholder="Enter company name"
                className="form-control"
                onChange={(e) => this.setState({ company_name: e.target.value })}
              />
              {errors.company_name && <div className="text-danger">{errors.company_name}</div>}
            </div>

            {/* Address */}
            <div className="form-group m-2">
              <input
                type="text"
                value={address}
                placeholder="Enter address"
                className="form-control"
                onChange={(e) => this.setState({ address: e.target.value })}
              />
              {errors.address && <div className="text-danger">{errors.address}</div>}
            </div>

            {/* GST Number */}
            <div className="form-group m-2">
              <input
                type="text"
                value={gstNumber}
                placeholder="Enter GST number"
                className="form-control"
                onChange={(e) => this.setState({ gstNumber: e.target.value })}
              />
              {errors.gstNumber && <div className="text-danger">{errors.gstNumber}</div>}
            </div>

            {/* General errors */}
            {errors.general && <div className="text-danger m-2">{errors.general}</div>}

            <div className="form-group m-2">
              <button
                className="btn btn-success w-100"
                onClick={this.sendCustomerToServer}
              >
                {id ? "Update Customer" : "Save Customer"}
              </button>
            </div>
          </div>
        )}

        {/* Customer List */}
        <h4>Customer List</h4>
        <table className="table table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>SRNO</th>
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
            {currentCustomers.length > 0 ? currentCustomers.map((cust,index) => (
              <tr key={cust.id}>
                <td>{index+1}</td>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone_no}</td>
                <td>{cust.company_name}</td>
                <td>{cust.address}</td>
                <td>{cust.gstNumber}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => this.setState({ showForm: true, errors: {}, ...cust })}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this customer?")) {
                        CustService.delCustomer(cust.id).then(() => this.loadCustomers());
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-danger fw-bold">No customers found</td>
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
