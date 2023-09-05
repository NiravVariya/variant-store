import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const notifications = () => {
    return (
        <div>
            <App />
            <TabsWithLine />
            <Footer />
        </div>
    );
};

export default WithAuth(notifications, USER_TYPE.shouldAuthenticated);