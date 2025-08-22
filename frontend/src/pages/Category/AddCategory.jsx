import React from "react";
import CategoryService from "../../services/CategoryService";
import { getCurrentUser } from "../../services/login.register";
import "../../styles/category.css";

export default class AddCategory extends React.Component {
  constructor() {
    super();
    const user = getCurrentUser();
    this.state = {
      categories: [],
      name: "",
      msg: "",
      search: "",
      editId: null, // for update
      userRole: user?.role || "user",
    };
  }

  componentDidMount() {
    this.loadCategories();
  }

  loadCategories = () => {
    CategoryService.getCategory()
      .then((res) => this.setState({ categories: res.data }))
      .catch((err) => console.error(err));
  };

  handleAddOrUpdate = () => {
    const { name, editId } = this.state;

    if (!name.trim()) {
      this.setState({ msg: "⚠ Category name is required" });
      return;
    }

    if (editId) {
      // update existing
      CategoryService.updateCategory(editId, { cname: name })
        .then((res) => {
          this.setState({ msg: res.data.message, name: "", editId: null });
          this.loadCategories();
        })
        .catch(() => this.setState({ msg: "❌ Update failed" }));
    } else {
      // add new
      CategoryService.saveCategory({ cname: name })
        .then((res) => {
          this.setState({ msg: res.data.message, name: "" });
          this.loadCategories();
        })
        .catch(() => this.setState({ msg: "❌ Add failed" }));
    }
  };

  handleDelete = (catId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      CategoryService.delCat(catId)
        .then(() => {
          this.setState({ msg: "✅ Category deleted successfully" });
          this.loadCategories();
        })
        .catch(() => this.setState({ msg: "❌ Delete failed" }));
    }
  };

  handleEdit = (category) => {
    this.setState({ name: category.cname, editId: category.cid });
  };

  handleSearch = (e) => {
    const searchValue = e.target.value;
    this.setState({ search: searchValue });

    if (!searchValue.trim()) {
      this.loadCategories();
      return;
    }

    CategoryService.searchCategory(searchValue)
      .then((res) => this.setState({ categories: res.data }))
      .catch(() => this.setState({ categories: [] }));
  };

  render() {
    const { categories, name, msg, search, editId, userRole } = this.state;

    return (
      <div className="container p-4">
        <h3 className="mb-3">📂 Category Management</h3>

        {/* Search (Both Admin & User) */}
        <div className="mb-3 d-flex">
          <input
            type="text"
            placeholder="🔍 Search category..."
            className="form-control w-50"
            value={search}
            onChange={this.handleSearch}
          />
        </div>

        {/* Add / Update Form (Admin only) */}
        {userRole === "admin" && (
          <div className="card p-3 mb-4 shadow">
            <h5 className="mb-3">{editId ? "✏ Update Category" : "➕ Add Category"}</h5>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
            <button
              className={`btn ${editId ? "btn-warning" : "btn-success"}`}
              onClick={this.handleAddOrUpdate}
            >
              {editId ? "Update" : "Add"}
            </button>
            <div className="mt-2 text-primary fw-bold">{msg}</div>
          </div>
        )}

        {/* Category List */}
        <table className="table table-striped table-hover text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Category ID</th>
              <th>Name</th>
              {userRole === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.cid}>
                  <td>{cat.cid}</td>
                  <td>{cat.cname}</td>
                  {userRole === "admin" && (
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => this.handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => this.handleDelete(cat.cid)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === "admin" ? "3" : "2"} className="text-danger">
                  🚫 No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
