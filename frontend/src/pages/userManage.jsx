import React, { Component } from "react";
import UserService from "../services/UserService";

class UserManage extends Component {
  state = {
    tab: "add",
    users: [],
    msg: "",
    errors: [],
    updateUserId: null,
    name: "",
    email: "",
    role: "user",
    password: "",
    searchTerm: "",
    currentPage: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    UserService.getAllUsers()
      .then(res => this.setState({ users: res.data.users || [] }))
      .catch(() => this.setState({ users: [] }));
  };

  handleSearch = (e) => {
    const keyword = e.target.value;
    this.setState({ searchTerm: keyword });
    if (!keyword) return this.loadUsers();

    UserService.searchUsers(keyword)
      .then(res => this.setState({ users: res.data.users || [] }))
      .catch(() => this.setState({ users: [] }));
  };

  saveUser = () => {
    const { name, email, role, password, updateUserId } = this.state;
    this.setState({ msg: "", errors: [] });

    if (!name || !email || !role || (!password && !updateUserId)) {
      this.setState({ errors: ["All fields are required"] });
      return;
    }

    if (updateUserId && !window.confirm("Do you really want to update this user?")) return;
    if (!updateUserId && !window.confirm("Do you really want to add this user?")) return;

    const userData = { name, email, role, password };
    const request = updateUserId
      ? UserService.updateUser(updateUserId, userData)
      : UserService.addUser(userData);

    request
      .then(() => {
        this.setState({
          msg: updateUserId ? "User updated successfully!" : "User added successfully!",
          name: "",
          email: "",
          role: "user",
          password: "",
          updateUserId: null,
          errors: [],
          tab: "view",
        });
        this.loadUsers();
      })
      .catch(err => {
        // Catch backend validation errors
        const resData = err.response?.data;
        if (resData?.errors) this.setState({ errors: resData.errors });
        else if (resData?.message) this.setState({ errors: [resData.message] });
        else this.setState({ errors: ["Operation failed"] });
      });
  };

  handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;

    UserService.deleteUser(id)
      .then(() => {
        this.setState({ msg: "User deleted successfully!" });
        this.loadUsers();
      })
      .catch(() => this.setState({ errors: ["Failed to delete user"] }));
  };

  handleUpdate = (id) => {
    const user = this.state.users.find(u => u.id === id);
    if (!user) return;

    this.setState({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      updateUserId: user.id,
      tab: "add",
      errors: [],
    });
  };

  changeTab = (tab) => this.setState({ tab });

  changePage = (delta) => this.setState(prev => ({ currentPage: prev.currentPage + delta }));

  render() {
    const { tab, users, msg, errors, name, email, role, password, searchTerm, currentPage, pageSize, updateUserId } = this.state;
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <div className="container p-4">
        <div className="mb-3">
          <button className={`btn ${tab==="add"?"btn-primary":"btn-outline-primary"} me-2`} onClick={()=>this.changeTab("add")}>Add User</button>
          <button className={`btn ${tab==="view"?"btn-primary":"btn-outline-primary"}`} onClick={()=>this.changeTab("view")}>View Users</button>
        </div>

        {msg && <p className="text-success">{msg}</p>}

        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul>{errors.map((err,i)=><li key={i}>{err}</li>)}</ul>
          </div>
        )}

        {tab==="add" &&
          <div className="card p-4">
            <h4>{updateUserId ? "Update User" : "Add User"}</h4>
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={e=>this.setState({name:e.target.value})} />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={e=>this.setState({email:e.target.value})} />
            </div>
            <div className="mb-3">
              <label>Role</label>
              <select className="form-control" value={role} onChange={e=>this.setState({role:e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {!updateUserId &&
              <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={e=>this.setState({password:e.target.value})} />
              </div>
            }
            <button className="btn btn-success w-100" onClick={this.saveUser}>
              {updateUserId ? "Update User" : "Save User"}
            </button>
          </div>
        }

        {tab==="view" &&
          <div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Search name or email" value={searchTerm} onChange={this.handleSearch} />
            </div>

            {paginatedUsers.length===0 ? <p className="text-danger">No users found</p> :
              <table className="table table-hover table-striped text-center">
                <thead className="table-dark">
                  <tr>
                    <th>SRNO</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user,index)=>(
                    <tr key={user.id}>
                      <td>{index+1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={()=>this.handleUpdate(user.id)}>Update</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>this.handleDelete(user.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }

            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-sm btn-secondary me-2" disabled={currentPage===1} onClick={()=>this.changePage(-1)}>Prev</button>
              <button className="btn btn-sm btn-secondary" disabled={currentPage*pageSize>=users.length} onClick={()=>this.changePage(1)}>Next</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default UserManage;
