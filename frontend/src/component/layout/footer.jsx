import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: "rgb(154, 166, 178)" }}>
          {/* Main Container */}
          <div className="container p-4 pb-0">
            {/* Links Section */}
            <section>
              <div className="row">
                {/* Contact Us */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <h5 className="text-uppercase">Contact Us</h5>
                  <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Molestiae modi cum ipsam ad, illo possimus laborum ut reiciendis obcaecati.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="col-lg-2 col-md-6 mb-4">
                  <h5 className="text-uppercase">Links</h5>
                  <ul className="list-unstyled">
                    <li><a href="#home" className="text-white">Home</a></li>
                    <li><a href="#about" className="text-white">About Us</a></li>
                    <li><a href="#feature" className="text-white">Feature</a></li>
                    <li><a href="#contact" className="text-white">Contact Us</a></li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="col-lg-2 col-md-6 mb-4">
                  <h5 className="text-uppercase">Contact</h5>
                  <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                    <li>Email: mhasalkarsneha@gmail.com</li>
                    <li>Phone: 9975763477</li>
                    <li>Address: Pune</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="mb-4" />

            {/* Call to Action */}
            <section>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <span>Register for free</span>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </div>
            </section>

            <hr className="mb-4" />

            {/* Social Media */}
            <section className="mb-4 text-center">
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="Facebook"><FaFacebookF /></a>
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="Twitter"><FaTwitter /></a>
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="Google"><FaGoogle /></a>
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="Instagram"><FaInstagram /></a>
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a className="btn btn-outline-light btn-floating m-1" href="#!" aria-label="GitHub"><FaGithub /></a>
            </section>
          </div>

          {/* Copyright */}
          <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", fontSize: "14px" }}>
            © 2025 Copyright:
            <a className="text-white ms-1" href="https://yourwebsite.com">YourWebsite.com</a>
          </div>
        </footer>
      </>
    );
  }
}
