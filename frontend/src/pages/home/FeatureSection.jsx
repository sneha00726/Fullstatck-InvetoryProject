import React from "react";
import ReactDom from 'react-dom';
import "../../styles/sections.css";

export default class FeatureSection  extends React.Component{

    render()
    {
        return <>
        <div id="feature" className="featuresection">
       <div className="container  ">
      <h2 className="text-center mb-4">Features</h2>
      <div className="row text-center">
        
        {/* Feature 1 */}
        <div className="col-md-4">
          <i className="bi bi-box-seam display-4 text-primary mb-3"></i>
          <h5>Stock Management</h5>
          <p>Track, add, and update product inventory in real-time with ease.</p>
        </div>
        
        {/* Feature 2 */}
        <div className="col-md-4">
          <i className="bi bi-people display-4 text-success mb-3"></i>
          <h5>Customer & Supplier Records</h5>
          <p>Maintain organized records for all customers and suppliers.</p>
        </div>
        
        {/* Feature 3 */}
        <div className="col-md-4">
          <i className="bi bi-shield-lock-fill display-4 text-warning mb-3"></i>
          <h5>Role-Based Access</h5>
          <p>Separate permissions for admin and staff </p>
        </div>

      </div>
    </div>
    </div>
        </>
    }
}