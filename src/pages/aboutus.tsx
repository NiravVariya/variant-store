import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import AboutUs from "@/components/AboutUs/AboutUs";

const aboutus = () => {
    return (
        <div>
            <App />
            <AboutUs />
            <Footer />
        </div>
    );
};

export default aboutus;