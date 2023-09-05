import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import { ForgotPassword } from "@/components/ForgotPassword/App";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const changepassword = () => {
    return (
        <div>
            <App />
            <TabsWithLine />
            <ForgotPassword />
            <Footer />
        </div>
    );
};

export default WithAuth(changepassword, USER_TYPE.shouldAuthenticated);