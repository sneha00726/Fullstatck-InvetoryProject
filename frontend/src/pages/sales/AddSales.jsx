import React from "react";
import ProductService from "../../services/ProductSerivce";
import SaleService from "../../services/salesService.jsx";
import { getCurrentUser } from "../../services/login.register";

export default class AddSale extends React.Component {
  constructor() {
    super();
    this.state = {
      customerId: "",
      products: [],
      selectedProductId: "",
      qty: "",
      price: 0,
      items: [],
      totalAmount: 0,
      paymentMode: "Cash",
      gstInvoice: "",
      msg: "",
      showInvoice: false,
    };
  }

  componentDidMount() {
    ProductService.getAllProducts()
      .then((res) => this.setState({ products: res.data }))
      .catch((err) => console.error("Failed to fetch product:", err));
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleProductSelect = (e) => {
    const prodId = e.target.value;
    const selectedProd = this.state.products.find((p) => p.pid === parseInt(prodId));

    this.setState({
      selectedProductId: prodId,
      price: selectedProd ? selectedProd.pprice : 0,
    });
  };

  addItem = () => {
    const { selectedProductId, qty, price, products } = this.state;
    if (!selectedProductId || !qty) {
      this.setState({ msg: "Select a product and quantity" });
      return;
    }

    const product = products.find((p) => p.pid === parseInt(selectedProductId));
    const subtotal = qty * price;

    const newItem = {
      productId: selectedProductId,
      pname: product.pname,
      qty,
      rate: price,
      subtotal,
    };

    this.setState((prev) => ({
      items: [...prev.items, newItem],
      totalAmount: prev.totalAmount + subtotal,
      selectedProductId: "",
      qty: "",
      price: 0,
    }));
  };

  handleSubmit = () => {
    const user = getCurrentUser();
    if (!user) {
      this.setState({ msg: "User not logged in!" });
      return;
    }

    const { customerId, items, totalAmount, paymentMode, gstInvoice } = this.state;
    if (!customerId || items.length === 0) {
      this.setState({ msg: "Fill customer and items!" });
      return;
    }

    const saleData = {
      invoiceNo: "INV-" + Date.now(),
      salesDate: new Date().toISOString().split("T")[0],
      customerId,
      items,
      paymentMode,
      gstInvoice,
    };

    SaleService.addSale(saleData, localStorage.getItem("token"))
      .then((res) => {
        this.setState({ msg: res.data.message, showInvoice: true });
      })
      .catch((err) => {
        this.setState({ msg: err.response?.data?.message || "Failed to save sale" });
      });
  };

  render() {
    const { products, qty, price, totalAmount, items, msg, showInvoice } = this.state;

    return (
      <div className="container mt-4">
        <h2>Create Sale</h2>

        {/* Customer ID input */}
        <div className="form-group m-2">
          <label>Customer ID</label>
          <input
            type="text"
            name="customerId"
            className="form-control"
            onChange={this.handleChange}
          />
        </div>

        {/* Product selection */}
        <div className="form-group m-2">
          <label>Product</label>
          <select
            className="form-control"
            value={this.state.selectedProductId}
            onChange={this.handleProductSelect}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.pid} value={p.pid}>
                {p.pname}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group m-2">
          <label>Quantity</label>
          <input
            type="number"
            name="qty"
            className="form-control"
            value={qty}
            onChange={this.handleChange}
          />
        </div>

        <div className="form-group m-2">
          <label>Price</label>
          <input type="text" value={price} className="form-control" disabled />
        </div>

        <button className="btn btn-secondary m-2" onClick={this.addItem}>
          Add Item
        </button>

        {/* Items table */}
        {items.length > 0 && (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.pname}</td>
                  <td>{i.qty}</td>
                  <td>{i.rate}</td>
                  <td>{i.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4>Total Amount: ₹{totalAmount}</h4>

        <div className="form-group m-2">
          <label>Payment Mode</label>
          <select name="paymentMode" onChange={this.handleChange} className="form-control">
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="form-group m-2">
          <label>GST Invoice</label>
          <input type="text" name="gstInvoice" onChange={this.handleChange} className="form-control" />
        </div>

        <button className="btn btn-primary m-2" onClick={this.handleSubmit}>
          Save Sale
        </button>

        {msg && <div className="alert alert-info m-3">{msg}</div>}

        {showInvoice && (
          <div className="invoice mt-4">
            <h3>Invoice</h3>
            <p>Customer ID: {this.state.customerId}</p>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.pname}</td>
                    <td>{i.qty}</td>
                    <td>{i.rate}</td>
                    <td>{i.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Total: ₹{totalAmount}</h4>
          </div>
        )}
      </div>
    );
  }
}
