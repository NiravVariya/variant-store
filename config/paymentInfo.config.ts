import PayPalIntegration from "@/components/Checkout/paypal"
import { StripeCheckout } from "@/components/Checkout/StripeCheckout";

export const paymentOptionsConfig: any = {
    stripe: {
        Component: StripeCheckout,
    },
    paypal: {
        Component: PayPalIntegration
    }
};
