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
      error: "",   //  added error state
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, role } = this.state;

    registerUser({ name, email, password, role })
      .then((res) => {
        this.setState({ message: res.message, error: "" });
        // Redirect to login after registration
        window.location.href = "/login";
      })
      .catch((err) => {
        const backendMessage =
          err.response?.data?.message || // validation / duplicate email
          err.message ||                 
          "Something went wrong";

        this.setState({ error: backendMessage, message: "" });
      });
  };

  goHome = () => {
    window.location.href = "/";
  };

  render() {
    const { name, email, password, role, message, error } = this.state;

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
                    <input   type="text"  value={name}   placeholder="Enter your name"  className="form-control"  onChange={(e) => this.setState({ name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="text"  value={email}   placeholder="Enter your email"   className="form-control"   onChange={(e) => this.setState({ email: e.target.value })}
                       />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input   type="password"   value={password}   placeholder="Enter your password"   className="form-control"  onChange={(e) =>  this.setState({ password: e.target.value })  }          />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <select  className="form-select"  value={role}  onChange={(e) => this.setState({ role: e.target.value })}   >
                      <option value="">Select role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-grid mb-2">
                    <button type="submit" className="btn btn-success">
                      Register
                    </button>
                  </div>
                </form>
                <div className="d-grid">
                  <button className="btn btn-secondary" onClick={this.goHome}>
                    Go to Home
                  </button>
                </div>

                {/*  show error or success */}
                {error && (
                  <p className="text-danger mt-3 text-center">{error}</p>
                )}
                {message && (
                  <p className="text-success mt-3 text-center">{message}</p>
                )}
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
