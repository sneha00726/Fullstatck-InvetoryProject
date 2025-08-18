import React, { Component } from "react";
import { useParams } from "react-router-dom";

let withRouterParams=(Component)=>
{
    let ComponetWithRouter=(props)=>
    {
        let params=useParams();
        return(
            <Component {...props}
            params={params}/>
        )
    }
    return ComponetWithRouter;
}
export default withRouterParams;