import React, { useState, useEffect } from "react";
import PurchaseService from "../services/purchaseService";
import SupplierService from "../services/supplierservice";
import ProductService from "../services/ProductSerivce";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddPurchase() {
  const [tab, setTab] = useState("add"); // "add" or "view"
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseProducts, setPurchaseProducts] = useState([{ product_id: "", qty: 1, product_price: 0, product_name: "" }]);
  const [supplierId, setSupplierId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [msg, setMsg] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [updatePurchaseId, setUpdatePurchaseId] = useState(null);

  // Pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Load suppliers, products, and purchases
  useEffect(() => {
    SupplierService.getSupplier()
      .then(res => {
        const list = Array.isArray(res.data.suppliers) ? res.data.suppliers : [];
        setSuppliers(list);
      })
      .catch(() => setSuppliers([]));

    ProductService.getAllProducts()
      .then(res => {
        const list = Array.isArray(res.data.products) ? res.data.products : [];
        setProducts(list);
      })
      .catch(() => setProducts([]));

    loadPurchases();
  }, []);

  const loadPurchases = () => {
    PurchaseService.viewPurchases()
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setPurchases(list);
      })
      .catch(() => setPurchases([]));
  };

  const handleProductChange = (index, field, value) => {
    const list = [...purchaseProducts];
    list[index][field] = value;

    if (field === "product_id") {
      const selected = products.find(p => p.pid === parseInt(value));
      if (selected) {
        list[index].product_price = selected.price;
        list[index].product_name = selected.pname;
        if (list[index].qty > selected.stock) list[index].qty = 1; // reset qty to 1
      }
    }

    if (field === "qty") {
      const selected = products.find(p => p.pid === parseInt(list[index].product_id));
      if (selected && value < 1) list[index].qty = 1; // prevent zero
    }

    setPurchaseProducts(list);
  };

  const addProductRow = () => setPurchaseProducts([...purchaseProducts, { product_id: "", qty: 1, product_price: 0, product_name: "" }]);
  const removeProductRow = index => {
    const list = [...purchaseProducts];
    list.splice(index, 1);
    setPurchaseProducts(list);
  };

  const calculateTotal = () => purchaseProducts.reduce((sum, p) => sum + p.qty * parseFloat(p.product_price || 0), 0);

  const savePurchase = () => {
    if (!supplierId || purchaseProducts.length === 0) { setMsg("Select supplier and at least one product"); return; }
    if (!invoiceNo) { setMsg("Enter Invoice No"); return; }

    const items = purchaseProducts.map(p => ({
      productid: parseInt(p.product_id),
      quantity: parseInt(p.qty),
      price: parseFloat(p.product_price)
    }));

    const purchaseData = {
      invoiceno: invoiceNo,
      purchasedate: new Date().toISOString().slice(0,10),
      supplierid: parseInt(supplierId),
      paymentmode: paymentMode,
      totalamount: calculateTotal(),
      gstinvoice: "GST-" + new Date().getTime(),
      items
    };

    const request = updatePurchaseId 
      ? PurchaseService.updatePurchase(updatePurchaseId, purchaseData)
      : PurchaseService.addPurchase(purchaseData);

    request.then(() => {
      setMsg(updatePurchaseId ? "Purchase updated successfully!" : `Purchase saved! Total: ₹${calculateTotal().toFixed(2)}`);
      setPurchaseProducts([{ product_id: "", qty: 1, product_price: 0, product_name: "" }]);
      setSupplierId(""); setInvoiceNo(""); setUpdatePurchaseId(null); setPaymentMode("cash");
      loadPurchases(); setTab("view");
    }).catch(err => {
      console.error(err.response?.data || err.message);
      setMsg("Operation failed");
    });
  };

  // Group purchases by invoice
  const groupedPurchases = purchases.reduce((acc, item) => {
    if (!acc[item.invoiceno]) acc[item.invoiceno] = [];
    acc[item.invoiceno].push(item);
    return acc;
  }, {});

  const filteredInvoices = Object.keys(groupedPurchases).filter(inv => inv.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedInvoices = filteredInvoices.slice((currentPage-1)*pageSize, currentPage*pageSize);

  const handleDelete = invoiceNo => {
    if (!window.confirm(`Delete purchase ${invoiceNo}?`)) return;
    const purchaseId = groupedPurchases[invoiceNo][0].id;

    PurchaseService.deletePurchase(purchaseId)
      .then(() => { setMsg("Purchase deleted successfully!"); loadPurchases(); })
      .catch(() => setMsg("Failed to delete purchase"));
  };

  const handleUpdate = invoiceNo => {
    const purchase = groupedPurchases[invoiceNo][0];
    setInvoiceNo(invoiceNo);
    setSupplierId(purchase.supplierid);
    setPaymentMode(purchase.paymentmode);
    setUpdatePurchaseId(purchase.id);

    const updatedProducts = groupedPurchases[invoiceNo].map(item => ({
      product_id: item.productid,
      qty: item.quantity,
      product_price: item.price,
      product_name: item.productname
    }));
    setPurchaseProducts(updatedProducts);
    setTab("add");
  };

  return (
    <div className="container p-4">
      <div className="mb-3">
        <button className={`btn ${tab==="add"?"btn-primary":"btn-outline-primary"} me-2`} onClick={()=>setTab("add")}>Add Purchase</button>
        <button className={`btn ${tab==="view"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setTab("view")}>View Purchases</button>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      {tab==="add" &&
        <div className="card p-4">
          <h4>{updatePurchaseId ? "Update Purchase" : "Add Purchase"}</h4>

          <div className="mb-3">
            <label>Supplier</label>
            <select className="form-control" value={supplierId} onChange={e=>setSupplierId(e.target.value)}>
              <option value="">Select Supplier</option>
              {Array.isArray(suppliers) && suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label>Invoice No</label>
            <input type="text" className="form-control" value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} placeholder="Enter invoice number"/>
          </div>

          <div className="mb-3">
            <label>Payment Mode</label>
            <select className="form-control" value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>

          {purchaseProducts.map((item,index)=>(
            <div className="row mb-2" key={index}>
              <div className="col">
                <select className="form-control" value={item.product_id} onChange={e=>handleProductChange(index,"product_id",e.target.value)}>
                  <option value="">Select Product</option>
                  {Array.isArray(products) && products.map(p=>(
                    <option key={p.pid} value={p.pid}>
                      {p.pname} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input type="number" min="1" className="form-control" value={item.qty} onChange={e=>handleProductChange(index,"qty",parseInt(e.target.value))}/>
              </div>
              <div className="col">
                <input type="text" className="form-control" value={item.product_price} readOnly/>
              </div>
              <div className="col-auto">
                {purchaseProducts.length>1 && <button className="btn btn-danger" onClick={()=>removeProductRow(index)}>Remove</button>}
              </div>
            </div>
          ))}

          <button className="btn btn-secondary mb-3" onClick={addProductRow}>Add Product</button>
          <div className="mb-3"><strong>Total Amount: ₹{calculateTotal().toFixed(2)}</strong></div>
          <button className="btn btn-success w-100" onClick={savePurchase}>{updatePurchaseId?"Update Purchase":"Save Purchase"}</button>
        </div>
      }

      {tab==="view" &&
        <div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Search Invoice No" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          </div>

          {paginatedInvoices.length===0 ? <p className="text-danger">No purchases found</p> :
            paginatedInvoices.map(inv => {
              const items = groupedPurchases[inv];
              const { suppliername, purchasedate, paymentmode, totalamount } = items[0];
              return (
                <div className="card mb-4" key={inv}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Invoice: {inv}</strong> | Supplier: {suppliername} | Date: {new Date(purchasedate).toLocaleDateString()} | Payment: {paymentmode} | Total: ₹{totalamount}
                    </div>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={()=>handleUpdate(inv)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(inv)}>Delete</button>
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
                        {items.map((item,index)=>(
                          <tr key={item.productname+index}>
                            <td>{index+1}</td>
                            <td>{item.productname}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>₹{(item.quantity*parseFloat(item.price)).toFixed(2)}</td>
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
            <button className="btn btn-sm btn-secondary me-2" disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)}>Prev</button>
            <button className="btn btn-sm btn-secondary" disabled={currentPage*pageSize>=filteredInvoices.length} onClick={()=>setCurrentPage(currentPage+1)}>Next</button>
          </div>
        </div>
      }
    </div>
  );
}
