import React from "react";
import "../../styles/headerfooter.css";
import logo from "../../assets/INVENZA-.png";
export default class Header extends React.Component 
{
  render() 
  {
    return (
      <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid header">
            <a className="navbar-brand d-flex align-items-center" href="#home">
              <img 
                src={logo} 
                alt="Invexa Logo" 
                className="logo-img"
              />
              {/*<span className="ms-2">INVEXA</span>*/}
            </a>

            <div className="collapse navbar-collapse option" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="#home">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#feature">Feature</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">About Us</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#footer">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}
