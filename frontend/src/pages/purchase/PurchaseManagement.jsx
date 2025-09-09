import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import PurchaseService from "../../services/PurchaseService";
import { Button, Table, Form } from "react-bootstrap";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Records per page
  const navigate = useNavigate();

  // Fetch all purchases
  const getPurchases = () => {
    PurchaseService.getAllPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getPurchases();
  }, []);

  // Search purchases
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        PurchaseService.searchPurchase(search)
          .then((res) => {
            setPurchases(res.data);
            setCurrentPage(1);
          })
          .catch((err) => console.error(err));
      } else {
        getPurchases();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Delete purchase
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      PurchaseService.deletePurchase(id)
        .then(() => getPurchases())
        .catch((err) => console.error(err));
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentPurchases = purchases.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(purchases.length / pageSize);

  const paginate = (page) => setCurrentPage(page);

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
          {currentPurchases.length > 0 ? (
            currentPurchases.map((p) => (
              <tr key={p.purchaseid}>
                <td>{p.invoiceno}</td>
                <td>{p.suppliername || p.supplierid}</td>
                <td>{p.purchasedate?.substring(0, 10)}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-danger fw-bold">
                🚫 No purchases found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
            >
              Prev
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default PurchaseManagement;
