import React from "react";
import PurchaseService from "../../services/PurchaseService";
import { Link } from "react-router-dom";

export default class PurchaseManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      invoiceno: "",
      purchasedate: "",
      supplierid: "",
      paymentmode: "cash",
      gstinvoice: "",
      items: [{ productid: "", quantity: "", price: "" }],
      message: "",
      validationErrors: [],
      purchases: [],
      showView: false,
    };
  }

  // Add or Update Purchase
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = { 
        invoiceno: this.state.invoiceno,
        purchasedate: this.state.purchasedate,
        supplierid: Number(this.state.supplierid),
        paymentmode: this.state.paymentmode,
        gstinvoice: this.state.gstinvoice,
        items: this.state.items.map(item => ({
          productid: Number(item.productid),
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };
      
      const res = await PurchaseService.addPurchase(purchaseData);
      this.setState({ message: res.data.message, validationErrors: [], items: [{ productid: "", quantity: "", price: "" }] });
      this.loadPurchases();
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        this.setState({ validationErrors: err.response.data.validationErrors });
      } else {
        this.setState({ message: "Error: " + (err.response?.data?.message || err.message) });
      }
    }
  };

  // Load purchases from DB
  loadPurchases = async () => {
    try {
      const res = await PurchaseService.viewPurchases();
      this.setState({ purchases: res.data, showView: true });
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new item row
  addItemRow = () => {
    this.setState({ items: [...this.state.items, { productid: "", quantity: "", price: "" }] });
  };

  // Handle item input change
  handleItemChange = (index, e) => {
    const items = [...this.state.items];
    items[index][e.target.name] = e.target.value;
    this.setState({ items });
  };

  render() {
    return (
      <div className="container mt-3">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg bg-light mb-4">
          <div className="container-fluid">
            <a className="navbar-brand">Purchase</a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={this.loadPurchases}>View Purchases</button></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Add Purchase Form */}
        <div className="card p-3 mb-4">
          <h4>Add Purchase</h4>
          {this.state.validationErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul>
                {this.state.validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}
          {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
          <form onSubmit={this.handleSubmit}>
            <div className="row mb-2">
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Invoice No" value={this.state.invoiceno} onChange={e => this.setState({ invoiceno: e.target.value })} />
              </div>
              <div className="col-md-4">
                <input type="date" className="form-control" value={this.state.purchasedate} onChange={e => this.setState({ purchasedate: e.target.value })} />
              </div>
              <div className="col-md-4">
                <input type="number" className="form-control" placeholder="Supplier ID" value={this.state.supplierid} onChange={e => this.setState({ supplierid: e.target.value })} />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <select className="form-control" value={this.state.paymentmode} onChange={e => this.setState({ paymentmode: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div className="col-md-8">
                <input type="text" className="form-control" placeholder="GST Invoice" value={this.state.gstinvoice} onChange={e => this.setState({ gstinvoice: e.target.value })} />
              </div>
            </div>

            {/* Purchase Items */}
            <h5 className="mt-3">Items</h5>
            {this.state.items.map((item, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-4">
                  <input type="number" name="productid" className="form-control" placeholder="Product ID" value={item.productid} onChange={(e) => this.handleItemChange(index, e)} />
                </div>
                <div className="col-md-4">
                  <input type="number" name="quantity" className="form-control" placeholder="Quantity" value={item.quantity} onChange={(e) => this.handleItemChange(index, e)} />
                </div>
                <div className="col-md-4">
                  <input type="number" name="price" className="form-control" placeholder="Price" value={item.price} onChange={(e) => this.handleItemChange(index, e)} />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mb-3" onClick={this.addItemRow}>Add Item</button>
            <br />
            <button type="submit" className="btn btn-success">Save Purchase</button>
          </form>
        </div>

        {/* View Purchases Table */}
        {this.state.showView && (
          <div className="card p-3 mt-4">
            <h4>All Purchases</h4>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Invoice No</th>
                  <th>Date</th>
                  <th>Supplier ID</th>
                  <th>Payment</th>
                  <th>GST</th>
                  <th>Total Amount</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {this.state.purchases.map((purchase) => (
                  <tr key={purchase.purchaseid}>
                    <td>{purchase.invoiceno}</td>
                    <td>{purchase.purchasedate}</td>
                    <td>{purchase.supplierid}</td>
                    <td>{purchase.paymentmode}</td>
                    <td>{purchase.gstinvoice}</td>
                    <td>{purchase.totalamount}</td>
                    <td>
                      {purchase.items.map((it, idx) => (
                        <div key={idx}>
                          ProductID: {it.productid}, Qty: {it.quantity}, Price: {it.price}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
