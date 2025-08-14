import React from "react";
import "../../styles/loginsignup.css";


export default class SignUp extends React.Component {

    constructor()
    {
        super();
        this.state={
            name:'',
            email:'',
            password:'',
            role:''
        }
    }

    render(){    
  return (
    <>
      <div className="head">
    <h2>Sign Up</h2>
      </div>
    <div className="  Login"> 
        <div className="form-group control">
        <label>Name:  </label>
        <input type="text" name="name" id=""  value={this.state.name} placeholder="enter the name"  class="form-control "
        onChange={(e)=>{this.setState({name:e.target.value})}}/>
        </div>
        <div className="form-group control">
        <label>email:  </label>
        <input type="text" name="email" id=""  value={this.state.email} placeholder="enter the email" class="form-control"
         onChange={(e)=>{this.setState({email:e.target.value})}}/>
        </div>
        <div className="form-group control" >
        <label>Password:   </label>
        <input type="text" name="Password" id=""  value={this.state.password} placeholder="enter the Password" class="form-control"
         onChange={(e)=>{this.setState({password:e.target.value})}}/>
        </div>
        <div className="form-group control">
        <label>role:  </label>
        <input type="text" name="role" id=""  value={this.state.role} placeholder="enter the role" class="form-control"
         onChange={(e)=>{this.setState({role:e.target.value})}}/>
        </div>
        <div className="form-group control">
            <input class="btn btn-primary" type="submit" value="Register"></input>
        </div>
       
        
        </div>
        </>
  );
  }
}
