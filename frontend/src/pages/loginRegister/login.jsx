import React from "react";
import "../../styles/loginsignup.css";
import { loginUser } from "../../services/login.register";

export default class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      message: ""
    };
  }

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const res = await loginUser({ email, password });
      this.setState({ message: res.message });
      // After login, redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      this.setState({ message: err.message || "Login failed" });
    }
  };

  render() {
    const { email, password, message } = this.state;
    return (
      <div className="Login">
        <h2>Login</h2>
        <form onSubmit={this.handleLogin}>
          <div className="form-group control">
            <label>Email:</label>
            <input type="email" value={email} placeholder="Enter email" className="form-control"
                   onChange={(e) => this.setState({ email: e.target.value })} required />
          </div>
          <div className="form-group control">
            <label>Password:</label>
            <input type="password" value={password} placeholder="Enter password" className="form-control"
                   onChange={(e) => this.setState({ password: e.target.value })} required />
          </div>
          <div className="form-group control">
            <input type="submit" className="btn btn-primary" value="Login" />
          </div>
          {message && <p style={{ color: "red" }}>{message}</p>}
        </form>
      </div>
    );
  }
}
