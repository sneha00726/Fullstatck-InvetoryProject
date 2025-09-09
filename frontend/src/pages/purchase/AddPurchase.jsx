import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PurchaseService from "../../services/PurchaseService";
import axios from "axios";
import { Button } from "react-bootstrap";

const AddPurchase = () => {
  const [purchase, setPurchase] = useState({
    invoiceno: "",
    purchasedate: "",
    supplierid: "",
    totalamount: 0, // auto-calculated now
    paymentmode: "cash",
    gstinvoice: "",
    items: [{ productid: "", quantity: "", price: "" }],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]); // ✅ for dropdown
  const [msg, setMsg] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // fetch suppliers
    axios
      .get("http://localhost:3000/api/suppliers/view", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setSuppliers(res.data);
        else if (res.data.suppliers) setSuppliers(res.data.suppliers);
        else setSuppliers([]);
      })
      .catch((err) => console.error(err));

    // ✅ fetch products for dropdown
    axios
      .get("http://localhost:3000/api/products/view", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setProducts(res.data);
        else setProducts([]);
      })
      .catch((err) => console.error(err));

    // fetch purchase by id if updating
    if (id) {
      PurchaseService.getPurchaseById(id)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const first = res.data[0];
            const formattedDate = first.purchasedate
              ? new Date(first.purchasedate).toISOString().split("T")[0]
              : "";

            const items = res.data.map((r) => ({
              id: r.itemid,
              productid: r.productid,
              quantity: r.quantity,
              price: r.price,
            }));

            setPurchase({
              id: first.purchaseid,
              invoiceno: first.invoiceno,
              purchasedate: formattedDate,
              supplierid: first.supplierid,
              totalamount: first.totalamount,
              paymentmode: first.paymentmode,
              gstinvoice: first.gstinvoice,
              items,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // ✅ auto calculate total amount
  useEffect(() => {
    const total = purchase.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);
    setPurchase((prev) => ({ ...prev, totalamount: total }));
  }, [purchase.items]);

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleItemChange = (i, e) => {
    const newItems = [...purchase.items];
    newItems[i][e.target.name] = e.target.value;
    setPurchase({ ...purchase, items: newItems });
  };

  const addItem = () => {
    setPurchase({
      ...purchase,
      items: [...purchase.items, { productid: "", quantity: "", price: "" }],
    });
  };

  const removeItem = (i) => {
    const newItems = [...purchase.items];
    newItems.splice(i, 1);
    setPurchase({ ...purchase, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const service = id
      ? PurchaseService.updatePurchase(id, purchase)
      : PurchaseService.addPurchase(purchase);

    service
      .then(() => {
        if (id) {
          alert("Purchase updated successfully");
        } else {
          alert("Purchase saved successfully");
        }
        setTimeout(() => navigate("/dashboard/purchases"), 1500);
      })
      .catch((err) => {
        setMsg(
          err.response?.data?.errors || [
            err.response?.data?.message || "Action failed",
          ]
        );
      });
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>{id ? "Update Purchase" : "Add Purchase"}</h3>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/purchases")}
        >
          View Purchases
        </Button>
      </div>

      {msg.length > 0 && (
        <ul
          className={`alert ${
            msg[0].includes("Purchase") ? "alert-success" : "alert-danger"
          }`}
        >
          {msg.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        {/* Invoice + Date */}
        <div className="row mb-3">
          <div className="col">
            <label>Invoice No</label>
            <input
              type="text"
              name="invoiceno"
              className="form-control"
              value={purchase.invoiceno}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>Purchase Date</label>
            <input
              type="date"
              name="purchasedate"
              className="form-control"
              value={purchase.purchasedate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Supplier */}
        <div className="row mb-3">
          <div className="col">
            <label>Supplier</label>
            <select
              name="supplierid"
              className="form-control"
              value={purchase.supplierid}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              {Array.isArray(suppliers) &&
                suppliers.map((s) => (
                  <option key={s.sid} value={s.sid}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col">
            <label>Total Amount</label>
            <input
              type="number"
              name="totalamount"
              className="form-control"
              value={purchase.totalamount}
              readOnly // ✅ auto calculated
            />
          </div>
        </div>

        {/* Payment + GST */}
        <div className="row mb-3">
          <div className="col">
            <label>Payment Mode</label>
            <select
              name="paymentmode"
              className="form-control"
              value={purchase.paymentmode}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div className="col">
            <label>GST Invoice</label>
            <input
              type="text"
              name="gstinvoice"
              className="form-control"
              value={purchase.gstinvoice}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Items */}
        <h5>Items</h5>
        {purchase.items.map((item, i) => (
          <div className="row mb-2" key={i}>
            <div className="col">
              {/* ✅ Dropdown for products */}
              <select
                name="productid"
                className="form-control"
                value={item.productid}
                onChange={(e) => handleItemChange(i, e)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.pid} value={p.pid}>
                    {p.pname}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <input
                type="number"
                placeholder="Quantity"
                name="quantity"
                className="form-control"
                value={item.quantity}
                onChange={(e) => handleItemChange(i, e)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                placeholder="Price"
                name="price"
                className="form-control"
                value={item.price}
                onChange={(e) => handleItemChange(i, e)}
              />
            </div>
            <div className="col">
              <Button variant="danger" onClick={() => removeItem(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}

        <Button variant="secondary" className="mb-3" onClick={addItem}>
          + Add Item
        </Button>
        <br />
        <Button type="submit" variant="success">
          {id ? "Update" : "Save"} Purchase
        </Button>
      </form>
    </div>
  );
};

export default AddPurchase;
