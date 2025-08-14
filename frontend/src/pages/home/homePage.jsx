import React from "react";
import ReactDom from 'react-dom';
import Layout from "../../component/layout/layout";
import HeroSection from "./heroSection";
import FeatureSection from "./FeatureSection";
import AboutSection from "./aboutSection";
import ReviewSection from "./reviewSection";
import "../../styles/sections.css";


export default class HomePage extends React.Component{

    render()
    {
        return <>
        
        <Layout>
        <HeroSection />
        <FeatureSection />
        <AboutSection/>
        <ReviewSection />
        </Layout>
        </>
    }
}