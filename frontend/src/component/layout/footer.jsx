import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../../styles/footer.css';

export default function Footer() {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div id="footer" className="footer-container">
      <footer className="footer-main">
        <div className="container p-1 bg-dark text-white">
          <section>
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-uppercase">
                <h5>Contact</h5>
                <p>
                 "Smarter Inventory. Simpler Business."
                </p>
              </div>

              <div className="col-lg-2 col-md-6 mb-4 mb-md-0 footer-links">
                <h5>Links</h5>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#feature">Feature</a></li>
                  <li><a href="#footer">Contact</a></li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-6 mb-4 mb-md-0 footer-links">
                <h5>Info</h5>
                <ul>
                  <li><p>Email: developer@gmail.com</p></li>
                  <li><p>Phone no: 8899887744</p></li>
                  <li><p>Address: Pune</p></li>
                </ul>
              </div>
            </div>
          </section>

          <hr />

          <section className="footer-register text-center">
            <p>
              <span>Register for free </span>
              <div className="button mt-2">
                <Link to="/signup" className="btn btn-info" role="button">
                  Register
                </Link>
              </div>
            </p>
          </section>

          <hr />

          <section className="footer-social text-center">
            <a href="#!"><FaFacebookF /></a>
            <a href="#!"><FaTwitter /></a>
            <a href="#!"><FaGoogle /></a>
            <a href="#!"><FaInstagram /></a>
            <a href="#!"><FaLinkedinIn /></a>
            <a href="#!"><FaGithub /></a>
          </section>

          {/* Back to Top button */}
          <div className="text-center mt-3">
            <button className="back-to-top-btn mt-2" onClick={scrollToTop}>
              Go up
            </button>
          </div>
        </div>

        <div className="footer-bottom text-center bg-secondary p-2">
           © {new Date().getFullYear()} INVEXA. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
