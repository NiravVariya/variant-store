import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import ContactUs from "@/components/ContactUs/ContactUs";

const contactus = () => {
    return (
        <div>
            <App />
            <ContactUs />
            <Footer />
        </div>
    );
};

export default contactus;