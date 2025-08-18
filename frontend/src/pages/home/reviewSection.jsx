import React from "react";
import ReactDom from 'react-dom';
import "../../styles/sections.css";

export default class ReviewSection  extends React.Component{

    render()
    {
        return <>
       
       <div className="container my-5 ">
  <h2 className="text-center mb-4">What Our Users Say</h2>
  <div className="row text-center">

    {/* Testimonial 1 */}
    <div className="col-md-4">
      <div className="card p-4 shadow-sm">
        <i className="bi  display-4 text-primary mb-3"></i>
        <p>
          "This system has made managing our store so much easier.
          Real-time updates save us hours every week!"
        </p>
        <h6 className="mt-3">— Priya Sharma</h6>
        <small className="text-muted">Retail Store Owner</small>
      </div>
    </div>

    {/* Testimonial 2 */}
    <div className="col-md-4">
      <div className="card p-4 shadow-sm">
        <i className="bi display-4 text-success mb-3"></i>
        <p>
          "The role-based access keeps our data secure, and the
          interface is very user-friendly."
        </p>
        <h6 className="mt-3">— Amit Verma</h6>
        <small className="text-muted">Warehouse Manager</small>
      </div>
    </div>

    {/* Testimonial 3 */}
    <div className="col-md-4">
      <div className="card p-4 shadow-sm">
        <i className="bi display-4 text-warning mb-3"></i>
        <p>
          "Detailed reports help us make better business decisions.
          Totally worth it!"
        </p>
        <h6 className="mt-3">— Neha Patil</h6>
        <small className="text-muted">Small Business Owner</small>
      </div>
    </div>

  </div>
</div>


        </>
    }
}