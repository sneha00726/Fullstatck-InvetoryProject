import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../../styles/footer.css';   

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer-container">
        <footer className="footer-main">
          <div className="container p-4  bg-dark">
            <section>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0 text-uppercase">
                  <h5>Contact</h5>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Molestiae modi cum ipsam ad, illo possimus laborum ut
                    reiciendis obcaecati.
                  </p>
                </div>

                <div className="col-lg-2 col-md-6 mb-4 mb-md-0 footer-links">
                  <h5>Links</h5>
                  <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About Us </a></li>
                    <li><a href="#feature">Feature</a></li>
                    <li><a href="#footer">Contact</a></li>
                  </ul>
                </div>
                 <div className="col-lg-2 col-md-6 mb-4 mb-md-0 footer-links">
                  <h5>Info</h5>
                  <ul>
                    <li><p>Email: mhasalkarsneha@gmail.com</p></li>
                    <li><p>Phone no: 9975763477</p></li>
                    <li><p>Address: Pune</p></li>
                    
                  </ul>
                </div>
              </div>
            </section>

            <hr />

            <section className="footer-register">
              <p>
                <span>Register for free    </span>
                <div className="button">
                            <Link to="/signup" className="btn btn-primary" role="button">
                             Register
                            </Link>
                          </div>
              </p>
            </section>

            <hr />

            <section className="footer-social">
              <a href="#!"><FaFacebookF /></a>
              <a href="#!"><FaTwitter /></a>
              <a href="#!"><FaGoogle /></a>
              <a href="#!"><FaInstagram /></a>
              <a href="#!"><FaLinkedinIn /></a>
              <a href="#!"><FaGithub /></a>
            </section>
          </div>

          <div className="footer-bottom">
            © 2025 Copyright:
            <a href="https://mdbootstrap.com/"> MDBootstrap.com</a>
          </div>
        </footer>
      </div>
    );
  }
}
