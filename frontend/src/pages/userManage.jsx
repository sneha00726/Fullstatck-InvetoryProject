import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";

export default function UserManage() {
  const [tab, setTab] = useState("add");
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [updateUserId, setUpdateUserId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    UserService.getAllUsers()
      .then(res => setUsers(res.data.users || []))
      .catch(() => setUsers([]));
  };

  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
    if (!keyword) {
      loadUsers();
      return;
    }

    UserService.searchUsers(keyword)
      .then(res => setUsers(res.data.users || []))
      .catch(() => setUsers([]));
  };

  const saveUser = () => {
    if (!name || !email || !role || (!password && !updateUserId)) {
      setMsg("All fields are required");
      return;
    }

    // Confirmation before save/update
    if (updateUserId) {
      if (!window.confirm("Do you really want to update this user?")) return;
    } else {
      if (!window.confirm("Do you really want to add this user?")) return;
    }

    const userData = { name, email, role, password };
    const request = updateUserId
      ? UserService.updateUser(updateUserId, userData)
      : UserService.addUser(userData);

    request
      .then(() => {
        setMsg(updateUserId ? "User updated successfully!" : "User added successfully!");
        setName(""); setEmail(""); setRole("user"); setPassword(""); setUpdateUserId(null);
        loadUsers();
        setTab("view");
      })
      .catch(err => {
        console.error(err.response ? err.response.data : err.message);
        setMsg("Operation failed");
      });
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this user?")) return;
    UserService.deleteUser(id)
      .then(() => { setMsg("User deleted successfully!"); loadUsers(); })
      .catch(() => setMsg("Failed to delete user"));
  };

  const handleUpdate = id => {
    UserService.getUserById(id)
      .then(res => {
        const user = res.data.user;
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword("");
        setUpdateUserId(user.id);
        setTab("add");
      })
      .catch(() => setMsg("Failed to fetch user details"));
  };

  // Pagination
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container p-4">
      <div className="mb-3">
        <button className={`btn ${tab==="add"?"btn-primary":"btn-outline-primary"} me-2`} onClick={()=>setTab("add")}>Add User</button>
        <button className={`btn ${tab==="view"?"btn-primary":"btn-outline-primary"}`} onClick={()=>setTab("view")}>View Users</button>
      </div>

      

      {tab==="add" &&
        <div className="card p-4">
          <h4>{updateUserId ? "Update User" : "Add User"}</h4>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select className="form-control" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {!updateUserId && 
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
          }
          <button className="btn btn-success w-100" onClick={saveUser}>{updateUserId ? "Update User" : "Save User"}</button>
        </div>
      }

      {tab==="view" &&
        <div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={e=>handleSearch(e.target.value)}
            />
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
                      <button className="btn btn-sm btn-warning me-2" onClick={()=>handleUpdate(user.id)}>Update</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }

          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-sm btn-secondary me-2" disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)}>Prev</button>
            <button className="btn btn-sm btn-secondary" disabled={currentPage*pageSize>=users.length} onClick={()=>setCurrentPage(currentPage+1)}>Next</button>
          </div>
        </div>
      }
    </div>
  );
}
