import React, { useState, useEffect } from "react";
import { Table, Button, Form, Alert, Pagination } from "react-bootstrap";
import PurchaseService from "../../services/PurchaseService";
import { Link } from "react-router-dom";

let PurchaseManagement = () => {
  let [purchases, setPurchases] = useState([]);
  let [formData, setFormData] = useState({
    invoiceno: "",
    purchasedate: "",
    supplierid: "",
    paymentmode: "cash",
    gstinvoice: "",
    items: [{ productid: "", quantity: "", price: "" }],
  });
  let [errors, setErrors] = useState([]);
  let [page, setPage] = useState(1);
  let [limit] = useState(5);
  let [totalPages, setTotalPages] = useState(1);
  let [showForm, setShowForm] = useState(false);

  // Fetch purchases
  let fetchPurchases = async (pageNo = 1) => {
    try {
      let res = await PurchaseService.getAllPurchases(pageNo, limit);
      let uniquePurchases = [];
      let seenIds = new Set();

      // Remove duplicate purchases based on purchaseid
      (res.data.rows || res.data).forEach((p) => {
        if (!seenIds.has(p.purchaseid)) {
          seenIds.add(p.purchaseid);
          uniquePurchases.push(p);
        }
      });

      setPurchases(uniquePurchases);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPurchases(page);
  }, [page]);

  // Input change handlers
  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let handleItemChange = (index, e) => {
    let newItems = [...formData.items];
    newItems[index][e.target.name] = e.target.value;
    setFormData({ ...formData, items: newItems });
  };

  let addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productid: "", quantity: "", price: "" }],
    });
  };

  let removeItem = (index) => {
    let newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await PurchaseService.addPurchase(formData);
      alert("Purchase added successfully!");
      setFormData({
        invoiceno: "",
        purchasedate: "",
        supplierid: "",
        paymentmode: "cash",
        gstinvoice: "",
        items: [{ productid: "", quantity: "", price: "" }],
      });
      setShowForm(false);
      setPage(1);
      fetchPurchases(1);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else if (err.response?.data?.error) setErrors([err.response.data.error]);
      else setErrors(["Failed to add purchase"]);
    }
  };

  return (
    <div className="container p-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>Purchase Management</h3>
        <div>
          <Button
            variant="success"
            onClick={() => setShowForm(true)}
            className="me-2"
          >
            Add Purchase
          </Button>
        </div>
      </div>

      {showForm && (
        <Form onSubmit={handleSubmit} className="mb-4">
          {errors.length > 0 && (
            <Alert variant="danger">
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Invoice No</Form.Label>
            <Form.Control
              type="text"
              name="invoiceno"
              value={formData.invoiceno}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              name="purchasedate"
              value={formData.purchasedate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Supplier ID</Form.Label>
            <Form.Control
              type="number"
              name="supplierid"
              value={formData.supplierid}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Payment Mode</Form.Label>
            <Form.Select
              name="paymentmode"
              value={formData.paymentmode}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>GST Invoice</Form.Label>
            <Form.Control
              type="text"
              name="gstinvoice"
              value={formData.gstinvoice}
              onChange={handleChange}
            />
          </Form.Group>

          <h5>Items</h5>
          {formData.items.map((item, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <Form.Control
                type="number"
                placeholder="Product ID"
                name="productid"
                value={item.productid}
                onChange={(e) => handleItemChange(index, e)}
              />
              <Form.Control
                type="number"
                placeholder="Quantity"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
              <Form.Control
                type="number"
                placeholder="Price"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
              />
              {index > 0 && (
                <Button variant="danger" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="info" onClick={addItem} className="mb-2">
            Add Another Item
          </Button>

          <Button type="submit" variant="success">
            Save Purchase
          </Button>
        </Form>
      )}

      {/* Purchases Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Total Amount</th>
            <th>Payment</th>
            <th>GST</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length > 0 ? (
            purchases.map((p) => (
              <tr key={p.purchaseid}>
                <td>{p.purchaseid}</td>
                <td>{p.invoiceno}</td>
                <td>{p.purchasedate}</td>
                <td>{p.suppliername}</td>
                <td>{p.totalamount}</td>
                <td>{p.paymentmode}</td>
                <td>{p.gstinvoice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-danger fw-bold">
                No purchases found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination with only Prev/Next */}
      <Pagination className="justify-content-center">
      <Pagination.Prev
      onClick={() => page > 1 && setPage(page - 1)}
      disabled={page === 1}
      >
      Prev
      </Pagination.Prev>
      <Pagination.Next
      onClick={() => page < totalPages && setPage(page + 1)}
      disabled={page === totalPages}
      >
      Next
      </Pagination.Next>
      </Pagination>

    </div>
  );
};

export default PurchaseManagement;
