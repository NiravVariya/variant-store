import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { ForgotPassword } from "@/components/ForgotPassword/App";

const forgotPassword = () => {
    return (
        <div>
            <App />
            <ForgotPassword />
            <Footer />
        </div>
    );
};

export default forgotPassword;