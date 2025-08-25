import React, { useState, useEffect } from "react";
import SalesService from "../../services/salesService";
import CustService from "../../services/customerService";
import ProductService from "../../services/ProductSerivce";
import "../../styles/productdash.css";

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
  const [updateSaleId, setUpdateSaleId] = useState(null);
  const [lastSale, setLastSale] = useState(null);

  // pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // initial data
  useEffect(() => {
    CustService.viewCustomer().then(res => setCustomers(res.data || [])).catch(() => setCustomers([]));
    ProductService.getAllProducts().then(res => setProducts(res.data || [])).catch(() => setProducts([]));
    loadSales();
  }, []);

  const loadSales = () => {
    SalesService.getAllSales()
      .then(res => setSales((res.data || []).reverse()))
      .catch(() => setSales([]));
  };

  // clear messages/summary whenever tab changes
  useEffect(() => {
    setMsg("");
    setLastSale(null);
  }, [tab]);

  const resetForm = () => {
    setSaleProducts([{ product_id: "", qty: 1, product_price: 0, product_name: "" }]);
    setCustomerId("");
    setInvoiceNo("");
    setUpdateSaleId(null);
  };

  const handleProductChange = (index, field, value) => {
    const list = [...saleProducts];
    list[index][field] = value;

    if (field === "product_id") {
      const selected = products.find(p => p.pid === parseInt(value));
      if (selected) {
        list[index].product_price = selected.price;
        list[index].product_name = selected.pname;
        if (list[index].qty > selected.stock) list[index].qty = selected.stock > 0 ? 1 : 0;
      }
    }

    if (field === "qty") {
      const selected = products.find(p => p.pid === parseInt(list[index].product_id));
      if (selected && value > selected.stock) {
        list[index].qty = selected.stock;
      }
    }

    setSaleProducts(list);
  };

  const addProductRow = () => setSaleProducts([...saleProducts, { product_id: "", qty: 1, product_price: 0, product_name: "" }]);
  const removeProductRow = index => {
    const list = [...saleProducts];
    list.splice(index, 1);
    setSaleProducts(list);
  };

  const calculateTotal = () => saleProducts.reduce((sum, p) => sum + (Number(p.qty) || 0) * parseFloat(p.product_price || 0), 0);

  const saveSale = () => {
    if (!customer_id) { window.alert("Please select a customer."); return; }
    if (!invoiceNo) { window.alert("Please enter Invoice No."); return; }
    if (saleProducts.length === 0 || saleProducts.some(p => !p.product_id || !p.qty)) {
      window.alert("Please select at least one product with quantity."); return;
    }

    const items = saleProducts.map(p => ({ productId: parseInt(p.product_id), qty: parseInt(p.qty) }));
    const saleData = {
      invoiceNo,
      salesDate: new Date().toISOString().slice(0, 10),
      customerId: parseInt(customer_id),
      items,
      paymentMode,
      gstInvoice: 1
    };

    const request = updateSaleId
      ? SalesService.updateSale(updateSaleId, saleData)
      : SalesService.addSale(saleData);

    request.then(res => {
      const { saleId, totalAmount, customerId, customerName } = res.data;
      const customer = customers.find(c => c.id === (customerId || parseInt(customer_id)));

      window.alert(
        `✅ Sale ${updateSaleId ? "Updated" : "Created"} Successfully!\n\n` +
        `Sale ID: ${saleId}\n` +
        `Customer: ${customerName || customer?.name || "Unknown"}\n` +
        `Total: ₹${totalAmount}`
      );

      setLastSale(null);
      setMsg("");
      resetForm();
      loadSales();
      setTab("add");
    })
    .catch(err => {
      console.error(err?.response?.data || err?.message);
      window.alert("❌ Operation failed. Please try again!");
    });
  };

  // group by invoice
  const groupedSales = sales.reduce((acc, item) => {
    if (!acc[item.invoiceNo]) acc[item.invoiceNo] = [];
    acc[item.invoiceNo].push(item);
    return acc;
  }, {});

  const filteredInvoices = Object.keys(groupedSales).filter(inv => inv.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = invoiceNo => {
    if (!window.confirm(`Delete sale with Invoice ${invoiceNo}? This will restore stock and remove all items in this invoice.`)) return;

    SalesService.deleteByInvoice(invoiceNo)
      .then(() => {
        window.alert("✅ Sale deleted successfully!");
        loadSales();
      })
      .catch(() => window.alert("❌ Failed to delete sale"));
  };

  const handleUpdate = invoiceNo => {
    const items = groupedSales[invoiceNo];
    const first = items[0];
    setInvoiceNo(invoiceNo);
    setCustomerId(first.customerId);
    setPaymentMode(first.paymentMode);
    setUpdateSaleId(first.salesId);

    const updatedProducts = items.map(it => ({
      product_id: it.productId,
      qty: it.qty,
      product_price: it.product_price || it.rate,
      product_name: it.product_name
    }));
    setSaleProducts(updatedProducts);
    setTab("add");
  };

  const goToAdd = () => {
    resetForm();
    setMsg("");
    setLastSale(null);
    setTab("add");
  };

  return (
    <div className="container p-4">
      <div className="mb-3">
        <button className={`btn ${tab === "add" ? "btn-primary" : "btn-outline-primary"} me-2`} onClick={goToAdd}>Add Sale</button>
        <button className={`btn ${tab === "view" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("view")}>View Sales</button>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      {/* ADD */}
      {tab === "add" &&
        <div className="card p-4">
          <h4>{updateSaleId ? "Update Sale" : "Add Sale"}</h4>
          <div className="mb-3">
            <label>Customer</label>
            <select className="form-control" value={customer_id} onChange={e => setCustomerId(e.target.value)}>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label>Invoice No</label>
            <input type="text" className="form-control" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="Enter invoice number" />
          </div>

          {saleProducts.map((item, index) => (
            <div className="row mb-2" key={index}>
              <div className="col">
                <select className="form-control" value={item.product_id} onChange={e => handleProductChange(index, "product_id", e.target.value)}>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.pid} value={p.pid} disabled={p.stock <= 0}>
                      {p.pname} {p.stock <= 0 ? "(Out of stock)" : `(Stock: ${p.stock})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="number" min="1" className="form-control"
                  value={item.qty}
                  onChange={e => handleProductChange(index, "qty", parseInt(e.target.value))}
                  max={products.find(p => p.pid === parseInt(item.product_id))?.stock || 1}
                />
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
          <button className="btn btn-success w-100" onClick={saveSale}>{updateSaleId ? "Update Sale" : "Save Sale"}</button>
        </div>
      }

      {/* VIEW */}
      {tab === "view" &&
        <div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Search Invoice No" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {paginatedInvoices.length === 0 ? <p className="text-danger">No sales found</p> :
            paginatedInvoices.map(inv => {
              const items = groupedSales[inv];
              const { customer_name, email, company_name, salesDate, totalAmount, paymentMode } = items[0];
              return (
                <div className="card mb-4" key={inv}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Invoice: {inv}</strong> | Customer: {customer_name} ({company_name}) | Email: {email} | Date: {new Date(salesDate).toLocaleDateString()} | Payment: {paymentMode} | Total: ₹{totalAmount}
                    </div>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleUpdate(inv)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inv)}>Delete</button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-hover table-striped align-middle text-center mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
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
              )
            })
          }

          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-sm btn-secondary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            <button className="btn btn-sm btn-secondary" disabled={currentPage * pageSize >= filteredInvoices.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      }
    </div>
  );
}
