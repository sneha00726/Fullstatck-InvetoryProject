import React from "react";
import "../../styles/loginsignup.css";
import { registerUser } from "../../services/login.register";

export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      role: "",
      message: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = this.state;

    try {
      const res = await registerUser({ name, email, password, role });
      this.setState({ message: res.message });
      // Redirect to login after registration
      window.location.href = "/login";
    } catch (err) {
      this.setState({ message: err.message || "Something went wrong" });
    }
  };

  render() {
    const { name, email, password, role, message } = this.state;

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white text-center">
                <h3>Sign Up</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      value={name}
                      placeholder="Enter your name"
                      className="form-control"
                      onChange={(e) => this.setState({ name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      className="form-control"
                      onChange={(e) => this.setState({ email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input
                      type="password"
                      value={password}
                      placeholder="Enter your password"
                      className="form-control"
                      onChange={(e) => this.setState({ password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => this.setState({ role: e.target.value })}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Register
                    </button>
                  </div>
                  {message && (
                    <p className="text-danger mt-3 text-center">{message}</p>
                  )}
                </form>
              </div>
              <div className="card-footer text-center">
                Already have an account? <a href="/login">Login here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
