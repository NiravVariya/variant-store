import { Checkout } from '@/components/Checkout/App'
import { Footer } from '@/components/Footer/Footer'
import { App } from '@/components/NavWithCenteredLogo/App'
import React from 'react';
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const checkout = () => {
  return (
    <div>
      <App />
      <Checkout />
      <Footer />
    </div>
  )
}

export default WithAuth(checkout, USER_TYPE.shouldAuthenticated);