import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import Confirmorder from "@/components/Confirmorder/Confirmorder";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const confirmorder = () => {
  return (
    <div>
      <App />
      <Confirmorder />
      <Footer />
    </div>
  );
};

export default WithAuth(confirmorder, USER_TYPE.shouldAuthenticated);
