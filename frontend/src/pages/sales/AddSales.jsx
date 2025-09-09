import React, { useState, useEffect } from "react";
import SalesService from "../../services/salesService";
import CustService from "../../services/customerService";
import ProductService from "../../services/ProductSerivce";
import "../../styles/productdash.css";
import { Modal, Button } from "react-bootstrap"; // Bootstrap Modal

export default function AddSales() {
  const [tab, setTab] = useState("add"); 
  const [customers, setCustomers] = useState([]);   
  const [products, setProducts] = useState([]);  
  const [invoiceNo, setInvoiceNo] = useState("");
  const [saleProducts, setSaleProducts] = useState([{ product_id: "", qty: 1, product_price: 0, product_name: "" }]);
  const [customer_id, setCustomerId] = useState("");     
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [msg, setMsg] = useState("");
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");   
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [showPreview, setShowPreview] = useState(false); //show the bill preview  
  const [showCustomerModal, setShowCustomerModal] = useState(false); // NEW modal state
  const [errors, setErrors] = useState({});
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone_no: "", company_name: "", address: "", gstNumber: "" });

  useEffect(() => {  
    loadCustomers();
    ProductService.getAllProducts()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]));

    loadSales();
  }, []);  //empty array so that it run only once when componet is laod 

  const loadCustomers = () => {   //fetch the customer 
    CustService.viewCustomer()
      .then(res => setCustomers(res.data || []))
      .catch(() => setCustomers([]));
  };

  const loadSales = () => {  //fetch all the sales 
    SalesService.getAllSales()
      .then(res => setSales((res.data || []).reverse()))
      .catch(() => setSales([]));
  };
 //when user select any product from dropdwoun 
  const handleProductChange = (index, field, value) => {
    const list = [...saleProducts];    //list for salesproduct 
    list[index][field] = value; 
 //if user select product then in db it find and fetch the name price qty 
    if (field === "product_id") {  
      const selected = products.find(p => p.pid.toString() === value); 
      if (selected) { 
        list[index].product_price = selected.price; 
        list[index].product_name = selected.pname;
        if (list[index].qty > selected.stock) list[index].qty = selected.stock > 0 ? 1 : 0;
      }
    }

    if (field === "qty") {   //if user change the qty then check 
      const selected = products.find(p => p.pid.toString() === list[index].product_id);
      if (selected && value > selected.stock) list[index].qty = selected.stock;
    }

    setSaleProducts(list);  //update the list 
  };

  const addProductRow = () => //to add new row for sales 
    setSaleProducts([...saleProducts, { product_id: "", qty: 1, product_price: 0, product_name: "" }]);

    //reomve the row 
  const removeProductRow = index => {
    const list = [...saleProducts];
    list.splice(index, 1);
    setSaleProducts(list);
  };
//sub caluclate 
  const calculateTotal = () =>
    saleProducts.reduce((sum, p) => sum + p.qty * parseFloat(p.product_price || 0), 0);

  //when user click on sales 
  const handleSaveClick = () => {
    if (!customer_id || saleProducts.length === 0) {
      window.alert("Select customer and at least one product");
      return;
    }
    if (!invoiceNo) {
      window.alert("Enter Invoice No");
      return;
    }
    setShowPreview(true);  //show preiew 
  };


  const saveSale = () => {
    //item create that contain the product info
    const items = saleProducts.map(p => ({
      productId: parseInt(p.product_id),
      qty: parseInt(p.qty),
      rate: p.product_price,
      product_name: p.product_name
    }));
//create sales data 
    const saleData = {
      invoiceNo,
      salesDate: new Date().toISOString().slice(0, 10),
      customerId: parseInt(customer_id),
      items,  //product id name qqty price 
      paymentMode,
      gstInvoice: 1,
    };

    SalesService.addSale(saleData)  //sales add 
      .then(res => {
        window.alert(
          `Sale added successfully!\nTotal: ₹${(res.data.totalAmount || calculateTotal()).toFixed(2)}`
        );
//reset the from 
        setSaleProducts([{ product_id: "", qty: 1, product_price: 0, product_name: "" }]);
        setCustomerId("");
        setInvoiceNo("");
        setPaymentMode("Cash");
        loadSales();
        setTab("view");
        setShowPreview(false);
      })
      .catch(err => {
        console.error(err.response?.data || err.message);
        window.alert("Operation failed. Please try again!");
        setShowPreview(false);
      });
  };
//to group the invoice number 
  const groupedSales = sales.reduce((acc, item) => {
    if (!acc[item.invoiceNo]) acc[item.invoiceNo] = [];
    acc[item.invoiceNo].push(item);
    return acc;
  }, {});
 

  //filter is used to search sales by invoice
  const filteredInvoices = Object.keys(groupedSales).filter(inv =>
    inv.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = invoiceNo => {
    if (!window.confirm(`Delete sale with Invoice ${invoiceNo}? This will restore stock and remove all items.`)) return;
    const sale = sales.find(s => s.invoiceNo === invoiceNo);
    if (!sale) return;

    SalesService.deleteSale(sale.salesID)
      .then(() => {
        window.alert(" Sale deleted successfully!");
        loadSales();
      })
      .catch(() => window.alert("Failed to delete sale"));
  };

  const handleDownload = (saleId, invoiceNo) => {  
    SalesService.downloadInvoice(saleId)
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a"); 
        link.href = url;
        link.setAttribute("download", `invoice_${invoiceNo}.pdf`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => window.alert(" Failed to download invoice"));
  };


// error handle function

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
    setErrors(errorsObj);  //
  } else {
    setErrors({ general: errorData?.message || "Customer action failed" });
  }
};

//if user want to add new customer it show model 
  const handleAddCustomer = () => {
    CustService.saveCustomer(newCustomer)
      .then(() => {
        window.alert("Customer added successfully!");
        loadCustomers();
        setNewCustomer({ name: "", email: "", phone_no: "", company_name: "", address: "", gstNumber: "" });
        setShowCustomerModal(false);
      })
      .catch(handleError);
  };

  return (
    <div className="container p-4">
      <div className="mb-3">
        <button className={`btn ${tab === "add" ? "btn-primary" : "btn-outline-primary"} me-2`} onClick={() => setTab("add")}>Add Sale</button>
        <button className={`btn ${tab === "view" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("view")}>View Sales</button>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Add Sale */}
      {tab === "add" && (
        <div className="card p-4">
          <h4>Add Sale</h4>

          <div className="mb-3">
            <label>Customer</label>
            <div className="d-flex">
              <select className="form-control" value={customer_id} onChange={e => setCustomerId(e.target.value)}>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
              </select>
              <button className="btn btn-success ms-2" onClick={() => setShowCustomerModal(true)}>+ Add Customer</button>
            </div>
          </div>

          <div className="mb-3">
            <label>Invoice No</label>
            <input type="text" className="form-control" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="Enter invoice number" />
          </div>

          <div className="mb-3">
            <label>Payment Mode</label>
            <select className="form-control" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Products */}
          {saleProducts.map((item, index) => (
            <div className="row mb-2" key={index}>
              <div className="col">
                <select className="form-control" value={item.product_id} onChange={e => handleProductChange(index, "product_id", e.target.value)}>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.pid} value={p.pid.toString()} disabled={p.stock <= 0 && p.pid.toString() !== item.product_id}>
                      {p.pname} {p.stock <= 0 && p.pid.toString() !== item.product_id ? "(Out of stock)" : `(Stock: ${p.stock})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input type="number" min="1" className="form-control" value={item.qty} onChange={e => handleProductChange(index, "qty", 
                  parseInt(e.target.value))} max={products.find(p => p.pid.toString() === item.product_id)?.stock || 1} />
              </div>
              <div className="col">
                <input type="text" className="form-control" value={item.product_price} readOnly />
              </div>
              <div className="col-auto">
                {saleProducts.length > 1 && <button className="btn btn-danger" onClick={() => removeProductRow(index)}>Remove</button>}
              </div>
            </div>
          ))}

          <button className="btn btn-secondary mb-3" onClick={addProductRow}>Add Product</button>
          <div className="mb-3"><strong>Total Amount: ₹{calculateTotal().toFixed(2)}</strong></div>
          <button className="btn btn-success w-100" onClick={handleSaveClick}>Save Sale</button>
        </div>
      )}

      {/* Bill Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Bill Preview</Modal.Title></Modal.Header>
        <Modal.Body>
          <h5>Customer: {customers.find(c => c.id.toString() === customer_id)?.name || "N/A"}</h5>
          <h6>Invoice No: {invoiceNo}</h6>
          <h6>Payment Mode: {paymentMode}</h6>
          <hr />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>SRNO</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {saleProducts.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.product_name}</td>
                  <td>{p.qty}</td>
                  <td>₹{p.product_price}</td>
                  <td>₹{(p.qty * p.product_price).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="text-end fw-bold">Total</td>
                <td>₹{calculateTotal().toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>Cancel</Button>
          <Button variant="success" onClick={saveSale}>Confirm & Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Customer Modal */}
      <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Customer</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="form-group mb-2">
            <input type="text" className="form-control" placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="form-group mb-2">
            <input type="email" className="form-control" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
          {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
              <div className="form-group mb-2">
        <input type="text" className="form-control" placeholder="Phone" value={newCustomer.phone_no} onChange={e => setNewCustomer({ ...newCustomer, phone_no: e.target.value })} />
        {errors.phone_no && <div className="text-danger">{errors.phone_no}</div>}
      </div>
      <div className="form-group mb-2">
        <input type="text" className="form-control" placeholder="Company Name" value={newCustomer.company_name} onChange={e => setNewCustomer({ ...newCustomer, company_name: e.target.value })} />
        {errors.company_name && <div className="text-danger">{errors.company_name}</div>}
      </div>
      <div className="form-group mb-2">
        <input type="text" className="form-control" placeholder="Address" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
        {errors.address && <div className="text-danger">{errors.address}</div>}
      </div>
      <div className="form-group mb-2">
        <input type="text" className="form-control" placeholder="GST Number" value={newCustomer.gstNumber} onChange={e => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })} />
        {errors.gstNumber && <div className="text-danger">{errors.gstNumber}</div>}
      </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCustomer}>Save Customer</Button>
        </Modal.Footer>
      </Modal>

      {/* View Sales */}
      {tab === "view" && (
        <div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Search Invoice No" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {paginatedInvoices.length === 0 ? (
            <p className="text-danger">No sales found</p>
          ) : (
            paginatedInvoices.map(inv => {
              const items = groupedSales[inv];
              const { customer_name, email, company_name, salesDate, totalAmount, paymentMode, salesID } = items[0];
              return (
                <div className="card mb-4" key={inv}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Invoice: {inv}</strong> | Customer: {customer_name} ({company_name}) | Email: {email} | Date:{" "}
                      {new Date(salesDate).toLocaleDateString()} | Payment: {paymentMode} | Total: ₹{totalAmount}
                    </div>
                    <div>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(inv)}>Delete</button>
                      <button className="btn btn-sm btn-info" onClick={() => handleDownload(salesID, inv)}>Download</button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-hover table-striped align-middle text-center mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>SrNo</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.product_name + index}>
                            <td>{index + 1}</td>
                            <td>{item.product_name}</td>
                            <td>{item.qty}</td>
                            <td>₹{item.product_price}</td>
                            <td>₹{(item.qty * parseFloat(item.product_price)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-sm btn-secondary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            <button className="btn btn-sm btn-secondary" disabled={currentPage * pageSize >= filteredInvoices.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
