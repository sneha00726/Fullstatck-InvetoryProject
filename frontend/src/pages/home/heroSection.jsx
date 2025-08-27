import React from "react";
import ReactDom from 'react-dom';
import { Link } from "react-router-dom";
import "../../styles/sections.css";

export default class HeroSection extends React.Component
{
    render()
    {
       return <>
       <div id="home" className="herosection">
       
        <div className="headline"> 
            <h2>Inventory Management Made Effortless</h2>
            <p>
                Powerful, user-friendly tools to track stock, suppliers, and sales in real-time.
            </p>
        </div>
         <div className="button">
            <Link to="/login" className="btn btn-info" role="button">
              Get Start
            </Link>
          </div>
       </div>
        </>
    }
}