import React from "react";
import CategoryService from "../../services/CategoryService";
import { getCurrentUser } from "../../services/login.register";
import "../../styles/category.css";

export default class CategoryManager extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      categories: [],
      name: "",
      msg: "",
      search: "",
      editId: null,
      currentPage: 1,
      categoriesPerPage: 9,
      showForm: false,
      userRole: user?.role || "user",
    };
  }

  componentDidMount() {
    this.loadCategories();
  }

  // Fetch all categories
  loadCategories = () => {
    CategoryService.getCategory()
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.error(err));
  };

  // Add or update category
  handleAddOrUpdate = () => {
    const { name, editId } = this.state;

    if (!name.trim()) {
      window.alert(" Category name is required");
      return;
    }

    const payload = { cname: name };//create a object t osend in bacckend 

    if (editId) {
      // Update existing category
      CategoryService.updateCategory(editId, payload)
        .then((res) => {
          window.alert(" Category updated successfully!");
          this.setState({
            msg: res.data.message,
            name: "",
            editId: null,
            showForm: false,
          });
          this.loadCategories();
        })
        .catch(() => {
          window.alert(" Update failed");
          this.setState({ msg: "Update failed" });
        });
    } else {
      // Add new category
      CategoryService.saveCategory(payload)
        .then((res) => {
          window.alert(" Category added successfully!");
          this.setState({ msg: res.data.message, name: "", showForm: false });
          this.loadCategories();
        })
        .catch((err) => {
          if (err.response && err.response.status === 409) {
            window.alert(" Category name already exists!");
            this.setState({ msg: "Category name already exists!" });
          } else {
            window.alert(" Add failed");
            this.setState({ msg: "Add failed" });
          }
        });
    }
  };

  // Delete a category
  handleDelete = (catId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      CategoryService.delCat(catId)
        .then(() => {
          this.setState({ msg: "Category deleted successfully" });
          this.loadCategories();
        })
        .catch(() => this.setState({ msg: "Delete failed" }));
    }
  };

  // Edit category (prefill form)
  handleEdit = (cat) => {
    this.setState({
      name: cat.cname,
      editId: cat.cid,
      showForm: true,
    });
  };

  // Search category
  handleSearch = (e) => {
    const searchValue = e.target.value;
    this.setState({ search: searchValue });

    if (!searchValue.trim()) {
      this.loadCategories();
      return;
    }

    CategoryService.searchCategory(searchValue)
      .then((res) => this.setState({ categories: res.data, currentPage: 1 }))
      .catch(() => this.setState({ categories: [] }));
  };

  // Pagination
  paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

  render() {
    const {
      categories,
      name,
      msg,
      search,
      editId,
      currentPage,
      categoriesPerPage,
      showForm,
      userRole,
    } = this.state;

    const indexOfLast = currentPage * categoriesPerPage;
    const indexOfFirst = indexOfLast - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    return (
      <div className="container p-4">
        {/* Search + Add */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input type="text"  className="form-control w-50"  placeholder="Search category..."  value={search}   onChange={this.handleSearch}  />
          {userRole === "admin" && (
            <button className="btn btn-primary ms-3" onClick={() => this.setState({ showForm: !showForm, name: "", editId: null })}
            >
              {showForm ? "View Categories" : "Add Category"}
            </button>
          )}
        </div>

        {/* Add / Update Form */}
        {showForm && userRole === "admin" && (
          <div className="card p-4 mb-4">
            <h4>{editId ? "Update Category" : "Add Category"}</h4>
            <div className="form-group m-2">
              <input type="text" value={name}  placeholder="Enter category name"  className="form-control"  onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
            <div className="form-group m-2">
              <button
                className={`btn w-100 ${editId ? "btn-warning" : "btn-success"}`}
                onClick={this.handleAddOrUpdate}
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}

        {/* Category Table */}
        <h4>Category List</h4>
        <table className="table table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>SRNO</th>
              <th>Name</th>
              {userRole === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentCategories.length > 0 ? ( currentCategories.map((cat,index) => (
                <tr key={cat.cid}>
                  <td>{index+1}</td>
                  <td>{cat.cname}</td>
                  {userRole === "admin" && (
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => this.handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => this.handleDelete(cat.cid)} >  Delete </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === "admin" ? "3" : "2"}className="text-danger fw-bold" >  No categories found   </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} >  <button className="page-link"onClick={() => this.paginate(currentPage - 1)} > Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${   currentPage === i + 1 ? "active" : "" }`} >
                  <button className="page-link"   onClick={() => this.paginate(i + 1)}  >   {i + 1}  </button>  </li>
              ))}
              <li className={`page-item ${ currentPage === totalPages ? "disabled" : ""}`} >
                <button className="page-link"onClick={() => this.paginate(currentPage + 1)}  >  Next  </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  }
}
