import React from "react";
import ProductService from "../../services/ProductSerivce";
import CategoryService from "../../services/CategoryService";
import SupplierService from "../../services/supplierservice";
import { getCurrentUser } from "../../services/login.register";
import "../../styles/productdash.css";

export default class AddProduct extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      pname: "",
      price: "",
      supplier_id: "",
      cid: "",
      stock: "",
      msg: "",
      categories: [],
      suppliers: [],
      products: [],
      currentPage: 1,
      productsPerPage: 10,
      showForm: false,
      search: "",
      userRole: user?.role || "user", // store role
    };
  }

  componentDidMount() {
    CategoryService.getCategory()
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.error(err));

    SupplierService.getSupplier()
      .then((res) => this.setState({ suppliers: res.data }))
      .catch((err) => console.error(err));

    this.loadProducts();
  }

  loadProducts = () => {
    ProductService.getAllProducts()
      .then((res) => this.setState({ products: res.data }))
      .catch((err) => console.error(err));
  };

  handleSearch = (e) => {
    const searchValue = e.target.value;
    this.setState({ search: searchValue });

    if (!searchValue.trim()) {
      this.loadProducts();
      return;
    }

    ProductService.searchProduct(searchValue)
      .then((res) => this.setState({ products: res.data, currentPage: 1 }))
      .catch(() => this.setState({ products: [] }));
  };

  sendProdToServer = () => {
    ProductService.saveProduct(this.state)
      .then((result) => {
        this.setState({ msg: result.data.message, showForm: false });
        this.loadProducts();
      })
      .catch(() => {
        this.setState({ msg: "Product insert failed: All fields are required" });
      });
  };

  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  render() {
    const {
      pname, price, supplier_id, cid, stock, msg,
      categories, suppliers, products, currentPage,
      productsPerPage, showForm, search, userRole
    } = this.state;

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = products.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
      <div className="container p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search product..."
            value={search}
            onChange={this.handleSearch}
          />
          {userRole === "admin" && (
            <button
              className="btn btn-primary ms-3"
              onClick={() => this.setState({ showForm: !showForm })}
            >
              {showForm ? "View Products" : "Add Product"}
            </button>
          )}
        </div>

        {/* Add Product Form (Admin only) */}
        {showForm && userRole === "admin" && (
          <div className="card p-4 mb-4">
            <h4>Add Product</h4>
            <div className="form-group m-2">
              <input type="text" value={pname} placeholder="Enter product name"
                     className="form-control" onChange={(e) => this.setState({ pname: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <input type="text" value={price} placeholder="Enter product price"
                     className="form-control" onChange={(e) => this.setState({ price: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <select className="form-control" value={supplier_id}
                      onChange={(e) => this.setState({ supplier_id: e.target.value })}>
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (<option key={sup.sid} value={sup.sid}>{sup.name}</option>))}
              </select>
            </div>
            <div className="form-group m-2">
              <select className="form-control" value={cid}
                      onChange={(e) => this.setState({ cid: e.target.value })}>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (<option key={cat.cid} value={cat.cid}>{cat.cname}</option>))}
              </select>
            </div>
            <div className="form-group m-2">
              <input type="text" value={stock} placeholder="Enter stock"
                     className="form-control" onChange={(e) => this.setState({ stock: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <button className="btn btn-success w-100" onClick={this.sendProdToServer}>Save Product</button>
            </div>
            <div className="text-success">{msg}</div>
          </div>
        )}

        {/* Product List (All roles can view/search) */}
        <h4>Product List</h4>
        <table className="table table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>PID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Supplier</th>
              {userRole === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? currentProducts.map((prod) => (
              <tr key={prod.pid}>
                <td>{prod.pid}</td>
                <td>{prod.pname}</td>
                <td>₹{prod.price}</td>
                <td>
                  {prod.stock > 0 ? <span className="badge bg-success">{prod.stock}</span> :
                    <span className="badge bg-danger">Out of stock</span>}
                </td>
                <td>{prod.cid}</td>
                <td>{prod.supplier_id}</td>
                {userRole === "admin" && (
                  <td>
                    <button className="btn btn-sm btn-warning me-2"
                            onClick={() => this.setState({ showForm: true, ...prod })}>Update</button>
                    <button className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this product?")) {
                                ProductService.delProd(prod.pid).then(() => this.loadProducts());
                              }
                            }}>Delete</button>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={userRole === "admin" ? "7" : "6"} className="text-danger fw-bold">🚫 No products found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => this.paginate(currentPage - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => this.paginate(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => this.paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
