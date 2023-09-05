import { ProductDetails } from "@/components/ProductWithCarousel/ProductDetails";
import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";

function ProductId() {
  return (
    <div>
      <App />
      <ProductDetails />
      <Footer />
    </div>
  );
}

export default ProductId;
