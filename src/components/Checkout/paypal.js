import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";

const PayPalIntegration = ({cartData, paymentKey, orderId}) => {
  const totalAmount = cartData.USDTotal;
  const router = useRouter()
  const clientID = paymentKey;
  const orderID = orderId;

  const buttonConfig = {
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalAmount,
            },
          },
        ],
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        router.push(`/confirmorder?id=${orderID}`)
      });
    },
    onError: (err) => {
      console.error(err);
    },
  };

  return (
    <PayPalScriptProvider options={{ "client-id": clientID }}>
      <div>
        <PayPalButtons {...buttonConfig} />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalIntegration;
