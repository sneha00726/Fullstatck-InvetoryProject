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
      pid: "",
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
      userRole: user?.role || "user",
    };
  }

  componentDidMount() {
    //  Categories
    CategoryService.getCategory()
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.error(err));

    //  Suppliers (handles API shape)
    SupplierService.getSupplier()
      .then((res) => {
        console.log("Supplier API Response:", res.data);
        const suppliers = Array.isArray(res.data.suppliers)
          ? res.data.suppliers
          : res.data; // fallback if API returns array directly
        this.setState({ suppliers });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ suppliers: [] });
      });

    this.loadProducts();
  }

  loadProducts = () => {
    ProductService.getAllProducts()
      .then((res) => this.setState({ products: res.data }))
      .catch((err) => console.error(err));
  };

//Handles both add and update product
sendProdToServer = (e) => {
  e.preventDefault();

  const { pid, pname, price, supplier_id, cid, stock } = this.state;

  // create product object
  const productObj = { pname, price, supplier_id, cid, stock };

  if (pid) {
    //Update existing product
    ProductService.updateProduct(pid, productObj)  
      .then(() => {
        this.setState({
          msg: "Product updated successfully!",
          pid: "",
          pname: "",
          price: "",
          supplier_id: "",
          cid: "",
          stock: ""
        });
        this.loadProducts(); // reload list
      })
      .catch((err) => {
        console.error(err);
        this.setState({ msg: " Error updating product" });
      });
  } else {
    // 🔹 Add new product
    ProductService.saveProduct(productObj)   
      .then(() => {
        this.setState({
          msg: "Product added successfully!",
          pname: "",
          price: "",
          supplier_id: "",
          cid: "",
          stock: ""
        });
        this.loadProducts(); // reload list
      })
      .catch((err) => {
        console.error(err);
        this.setState({ msg: "Error adding product" });
      });
  }
};


  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  paginate = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      pid,
      pname,
      price,
      supplier_id,
      cid,
      stock,
      msg,
      categories,
      suppliers,
      products,
      currentPage,
      productsPerPage,
      showForm,
      search,
      userRole,
    } = this.state;

    const filteredProducts = products.filter((p) =>
      p.pname.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
              onClick={() =>
                this.setState({
                  showForm: !showForm,
                  pid: "",
                  pname: "",
                  price: "",
                  supplier_id: "",
                  cid: "",
                  stock: "",
                })
              }
            >
              {showForm ? "View Products" : "Add Product"}
            </button>
          )}
        </div>

        {/* Add / Update Product Form (Admin only) */}
        {showForm && userRole === "admin" && (
          <div className="card p-4 mb-4">
            <h4>{pid ? "Update Product" : "Add Product"}</h4>
            <form onSubmit={this.sendProdToServer}>
              <div className="form-group m-2">
                <input type="text" value={pname}
                  placeholder="Enter product name"
                  className="form-control"
                  onChange={(e) => this.setState({ pname: e.target.value })}
                  required
                />
              </div>
              <div className="form-group m-2">
                <input
                  type="number"
                  value={price}
                  placeholder="Enter product price"
                  className="form-control"
                  onChange={(e) => this.setState({ price: e.target.value })}
                  required
                />
              </div>
              {/* Supplier dropdown */}
              <div className="form-group m-2">
                <select
                  className="form-control"
                  value={supplier_id}
                  onChange={(e) =>
                    this.setState({ supplier_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((sup) => (
                    <option key={sup.sid} value={sup.sid}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Category dropdown */}
              <div className="form-group m-2">
                <select
                  className="form-control"
                  value={cid}
                  onChange={(e) => this.setState({ cid: e.target.value })}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.cid} value={cat.cid}>
                      {cat.cname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group m-2">
                <input
                  type="number"
                  value={stock}
                  placeholder="Enter stock"
                  className="form-control"
                  onChange={(e) => this.setState({ stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-group m-2">
                <button type="submit" className="btn btn-success w-100">
                  {pid ? "Update Product" : "Save Product"}
                </button>
              </div>
              <div className="text-success">{msg}</div>
            </form>
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
            {currentProducts.length > 0 ? (
              currentProducts.map((prod) => {
                const categoryName =
                  categories.find((c) => c.cid === prod.cid)?.cname || prod.cid;
                const supplierName =
                  suppliers.find((s) => s.sid === prod.supplier_id)?.name ||
                  prod.supplier_id;

                return (
                  <tr key={prod.pid}>
                    <td>{prod.pid}</td>
                    <td>{prod.pname}</td>
                    <td>₹{prod.price}</td>
                    <td>
                      {prod.stock > 0 ? (
                        <span className="badge bg-success">{prod.stock}</span>
                      ) : (
                        <span className="badge bg-danger">Out of stock</span>
                      )}
                    </td>
                    <td>{categoryName}</td>
                    <td>{supplierName}</td>
                    {userRole === "admin" && (
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            this.setState({
                              showForm: true,
                              pid: prod.pid,
                              pname: prod.pname,
                              price: prod.price,
                              supplier_id: prod.supplier_id,
                              cid: prod.cid,
                              stock: prod.stock,
                            })
                          }
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              ProductService.delProd(prod.pid).then(() =>
                                this.loadProducts()
                              );
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={userRole === "admin" ? "7" : "6"}
                  className="text-danger fw-bold"
                >
                  🚫 No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => this.paginate(currentPage - 1)}
              >
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => this.paginate(i + 1)}
                >
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
                onClick={() => this.paginate(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
