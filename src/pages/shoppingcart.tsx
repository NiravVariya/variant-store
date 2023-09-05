import { Footer } from '@/components/Footer/Footer'
import { App } from '@/components/NavWithCenteredLogo/App'
import { ShopingCart } from '@/components/ShopingCart/ShopingCart'
import React from 'react'

const Shoppingcart = () => {

  return (
    <div>
      <App />
      <ShopingCart />
      <Footer />
    </div>
  )
}

export default Shoppingcart
