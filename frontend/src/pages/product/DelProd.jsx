import React from "react";
import ReactDom from 'react-dom';
import ProductSerivce from "../../services/ProductSerivce";
import ViewProduct from "./viewProduct";

export default class DelProd extends React.Component{
    constructor(props){
        super(props);
        this.state={
            message:''
            
        }
    }
   setPid=(pid)=>
   {
     let promise=ProductSerivce.delProd(pid);
           promise.then((result)=>
        {
           console.log(result.data.message);
           this.setState({message:result.data.message});
        }).catch((err)=>
        {
           
        });
   }
    render()
    {
        return <>
     {this.state.message.length>0?"record deleted":"some problem "}
        </>
    }
  

        componentDidMount()
        {
            let {pid}=this.props.params;
        this.setPid(pid);
          
        
        }
    
}