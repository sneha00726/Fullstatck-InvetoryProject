import React, { useState } from "react";
import { loginUser } from "../../services/login.register";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });

      // Show success alert
      alert(res.message || "Login successful!");

      // Redirect after alert
      window.location.href = "/dashboard";
    } catch (err) {
      // Show failure alert
      alert(err.message || "Login failed! Please try again.");
    }
  };

  const goHome = () => {
    window.location.href = "/";
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid mb-2">
                  <button type="submit" className="btn btn-success">
                    Login
                  </button>
                </div>
              </form>
              <div className="d-grid">
                <button className="btn btn-secondary" onClick={goHome}>
                  Go to Home
                </button>
              </div>
              {message && <p className="text-danger mt-3 text-center">{message}</p>}
            </div>
            <div className="card-footer text-center">
              Don't have an account? <a href="/signup">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
