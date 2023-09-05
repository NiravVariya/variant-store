import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import Orderlist from "@/components/Orderlist/Orderlist";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const order = () => {
    return (
        <div>
            <App />
            <TabsWithLine />
            <Orderlist />
            <Footer />
        </div>
    );
};

export default WithAuth(order, USER_TYPE.shouldAuthenticated);