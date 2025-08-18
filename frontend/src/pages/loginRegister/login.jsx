import React from "react";
import "../../styles/loginsignup.css";
import SignUp from "./signUp";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default class LoginPage extends React.Component {
    constructor()
    {
        super();
        this.state={
            email:'',
            password:''
        }

    }
   
render()
{
    return<>
    <div className="head">
    <h2>login</h2>
      </div>
      <div className="  Login"> 
        <div className="form-group control">
        <label>email:  </label>
        <input type="text" name="email" id=""  value={this.state.email} placeholder="enter the email"  class="form-control "
        onChange={(e)=>{this.setState({email:e.target.value})}}/>
        </div>
        <div className="form-group control">
        <label>password:  </label>
        <input type="text" name="password" id=""  value={this.state.password} placeholder="enter the password" class="form-control"
         onChange={(e)=>{this.setState({password:e.target.value})}}/>
        </div>
        
       <div className="d-flex justify-content-center align-items-center gap-3">
                
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  login
                </Link>
              </div>
        <div className="form-group control">
            <a href="/signup">Sign up</a>
        </div>
       
        
        </div>
    
    
    </>
}


}
