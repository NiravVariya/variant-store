import useTranslation from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import { checkout } from "./checkout";
import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

export const StripeCheckout = ({ cartData, paymentKey, orderId }: any) => {
  const reduxData = useSelector((state: any) => state.icon);
  const currencyData = reduxData.currency ? reduxData.currency : "USD";
  const { t } = useTranslation();

  const handleStripePayment = () => {
    checkout({
      carts: cartData,
      orderID: orderId,
      currencyData,
      stripeKey: paymentKey
    })
  }
  return (
    <>
    <Stack spacing="8">
      <Button
        className="btn"
        colorScheme="blue"
        size="lg"
        py="7"
        onClick={() => {
          handleStripePayment();
        }}
      >
        {t("Stripe.Button")}
      </Button>
    </Stack>
    </>
  );
};
