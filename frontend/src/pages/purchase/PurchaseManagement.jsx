import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import PurchaseService from "../../services/PurchaseService.js";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    invoiceno: "",
    purchasedate: "",
    supplierid: "",
    paymentmode: "",
    gstinvoice: "",
    items: [],
  });

  // Fetch purchases
  const fetchPurchases = () => {
    PurchaseService.getAllPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Delete Purchase
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      PurchaseService.deletePurchase(id).then(() => fetchPurchases());
    }
  };

  // Search Purchase
  const handleSearch = () => {
    if (!search.trim()) return fetchPurchases();
    PurchaseService.searchPurchase(search)
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  };

  // Modal Input change
  const handleModalChange = (field, value) =>
    setModalData({ ...modalData, [field]: value });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...modalData.items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setModalData({ ...modalData, items: updatedItems });
  };

  const addItemRow = () =>
    setModalData({
      ...modalData,
      items: [...modalData.items, { productid: "", quantity: 1, price: 1 }],
    });

  const removeItemRow = (index) =>
    setModalData({
      ...modalData,
      items: modalData.items.filter((_, i) => i !== index),
    });

  // Open Modal
  const openModal = (purchase = null) => {
    if (purchase) {
      // Map items for modal
      const items = purchase.items || purchase.products || [];
      setModalData({
        id: purchase.purchaseid,
        invoiceno: purchase.invoiceno,
        purchasedate: purchase.purchasedate,
        supplierid: purchase.supplierid,
        paymentmode: purchase.paymentmode,
        gstinvoice: purchase.gstinvoice,
        items: items.map((i) => ({
          id: i.itemid,
          productid: i.productid,
          quantity: i.quantity,
          price: i.price,
        })),
      });
    } else {
      setModalData({
        id: null,
        invoiceno: "",
        purchasedate: "",
        supplierid: "",
        paymentmode: "",
        gstinvoice: "",
        items: [],
      });
    }
    setShowModal(true);
  };

  // Submit Add/Update
  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = modalData.items.filter(
      (i) => i.productid && i.quantity > 0 && i.price > 0
    );
    if (!validItems.length) return alert("Add at least one valid item.");

    const payload = { ...modalData, items: validItems };

    const apiCall = modalData.id
      ? PurchaseService.updatePurchase(modalData.id, payload)
      : PurchaseService.addPurchase(payload);

    apiCall
      .then(() => {
        fetchPurchases();
        setShowModal(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h3>Purchase Management</h3>

      {/* Search + Add */}
      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Search by invoice or supplier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" className="ms-2" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="primary" className="ms-2" onClick={() => openModal()}>
          + Add Purchase
        </Button>
      </div>

      {/* Table */}
      <Table striped bordered>
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Payment</th>
            <th>GST</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.purchaseid}>
              <td>{p.invoiceno}</td>
              <td>{p.suppliername}</td>
              <td>{p.purchasedate}</td>
              <td>{p.totalamount}</td>
              <td>{p.paymentmode}</td>
              <td>{p.gstinvoice}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => openModal(p)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p.purchaseid)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalData.id ? "Update Purchase" : "Add Purchase"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label>Invoice No</Form.Label>
                <Form.Control
                  value={modalData.invoiceno}
                  onChange={(e) =>
                    handleModalChange("invoiceno", e.target.value)
                  }
                  required
                />
              </Col>
              <Col>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  value={modalData.purchasedate}
                  onChange={(e) =>
                    handleModalChange("purchasedate", e.target.value)
                  }
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Supplier ID</Form.Label>
                <Form.Control
                  value={modalData.supplierid}
                  onChange={(e) =>
                    handleModalChange("supplierid", e.target.value)
                  }
                  required
                />
              </Col>
              <Col>
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  value={modalData.paymentmode}
                  onChange={(e) =>
                    handleModalChange("paymentmode", e.target.value)
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </Form.Select>
              </Col>
            </Row>

            <Form.Label>GST Invoice</Form.Label>
            <Form.Control
              value={modalData.gstinvoice}
              onChange={(e) =>
                handleModalChange("gstinvoice", e.target.value)
              }
            />

            <h5 className="mt-3">Items</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {modalData.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.productid}
                        onChange={(e) =>
                          handleItemChange(i, "productid", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          handleItemChange(i, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.price}
                        min={1}
                        onChange={(e) =>
                          handleItemChange(i, "price", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItemRow(i)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button variant="secondary" onClick={addItemRow}>
              + Add Item
            </Button>
            <Button type="submit" className="ms-2">
              {modalData.id ? "Update" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PurchaseManagement;