import React from "react";
import "../../styles/loginsignup.css";
import { registerUser } from "../../services/login.register";


export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      role: '',
      message: ''
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
  }

  render() {
    const { name, email, password, role, message } = this.state;

    return (
      <>
        <div className="head">
          <h2>Sign Up</h2>
        </div>
        <div className="Login">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group control">
              <label>Name:</label>
              <input type="text" value={name} placeholder="Enter name" className="form-control"
                     onChange={(e) => this.setState({ name: e.target.value })} required />
            </div>
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
              <label>Role:</label>
              <input type="text" value={role} placeholder="Enter role (admin/user)" className="form-control"
                     onChange={(e) => this.setState({ role: e.target.value })} required />
            </div>
            <div className="form-group control">
              <input type="submit" className="btn btn-primary" value="Register" />
            </div>
            {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
          </form>
        </div>
      </>
    );
  }
}
