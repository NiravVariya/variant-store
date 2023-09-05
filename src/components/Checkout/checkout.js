export async function checkout({ carts, orderID, currencyData, stripeKey }) {
  const stripe = require('stripe')(stripeKey);

  let lineItems = [];
  carts.products?.map((item) => {
    lineItems.push({
      quantity: item.variantInfo.ChooseQty,
      price_data: {
        currency: currencyData == "USD" ? "USD" : currencyData,
        product_data: { name: item.ProductName.en },
        // unit_amount: currencyData == "OMR" || currencyData == "KWD" ? item.ProductPrice[currencyData == "USD" ? "USD" : "AED"] * 1000 :
        //   item.ProductPrice[currencyData == "USD" ? "USD" : "AED"] * 100
        unit_amount: currencyData == "OMR" || currencyData == "KWD" ?
          item.variantInfo.selectedVariantPrice[currencyData == "USD" ? "USDPrice" : "AEDPrice"] * 1000 :
          item.variantInfo.selectedVariantPrice[currencyData == "USD" ? "USDPrice" : "AEDPrice"] * 100
      },
    });
  })
  let checkoutData = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${window.location.origin}/confirmorder?paymentStatus=Success&orderID=${orderID}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}?cancelorder=true`,
  });
  window.location.href = checkoutData.url
}