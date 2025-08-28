import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import PurchaseService from "../../services/PurchaseService";
import { Button, Table, Form } from "react-bootstrap";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getPurchases = () => {
    PurchaseService.getAllPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getPurchases();
  }, []);

  // Fetch purchases automatically on search input change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        PurchaseService.searchPurchase(search)
          .then((res) => setPurchases(res.data))
          .catch((err) => console.error(err));
      } else {
        getPurchases();
      }
    }, 300); // Wait 300ms after typing stops

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      PurchaseService.deletePurchase(id)
        .then(() => getPurchases())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h3>Purchase Management</h3>
        <Button
          variant="success"
          onClick={() => navigate("/dashboard/purchases/add")}
        >
          + Add Purchase
        </Button>
      </div>

      {/* Search input */}
      <Form.Control
        type="text"
        placeholder="Search by invoice or supplier"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>GST Invoice</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.purchaseid}>
              <td>{p.invoiceno}</td>
              <td>{p.suppliername || p.supplierid}</td>
              <td>{p.purchasedate}</td>
              <td>{p.totalamount}</td>
              <td>{p.paymentmode}</td>
              <td>{p.gstinvoice}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() =>
                    navigate(`/dashboard/purchases/add/${p.purchaseid}`)
                  }
                >
                  Update
                </Button>
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

      <Outlet />
    </div>
  );
};

export default PurchaseManagement;
