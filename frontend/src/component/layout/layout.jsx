import React from "react";
import ReactDom from 'react-dom';
import Header from "./header";
import Footer from "./footer";

export default class Layout extends React.Component{

    render()
    {
        return <>
        <Header/>
        <div>{this.props.children}</div>
       <Footer/>
        </>
    }
}