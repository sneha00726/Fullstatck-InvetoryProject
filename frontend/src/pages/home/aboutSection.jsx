import React from "react";
import ReactDom from 'react-dom';
import "../../styles/sections.css";

export default class AboutSection  extends React.Component{

    render()
    {
        return <>
       <div id="about" className="  aobutsection">
  
    
    {/* Text Section */}
    <div className="textSection">
      <h2>About Our Inventory Management System</h2>
      <p>
        Our Inventory Management System is a full-stack web application designed to
        simplify stock tracking, supplier management, and sales reporting.
        Built using React for the frontend, Node.js & Express.js for the backend,
        and MySQL for the database, it provides a secure and user-friendly
        platform for businesses to manage their operations efficiently.
      </p>
      <p>
        Whether you run a small shop or a large company, the system offers real-time updates, 
        role-based access, and clear insights to support smart business decisions.
      </p>
    

    
  </div>
</div>
        </>
    }
}