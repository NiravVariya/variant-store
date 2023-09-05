import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { Profile } from "@/components/Profile/App";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const MainProfile = () => {
    return (<>
        <App />
        <TabsWithLine />
        <Profile />
        <Footer />
    </>);
};

export default WithAuth(MainProfile, USER_TYPE.shouldAuthenticated);