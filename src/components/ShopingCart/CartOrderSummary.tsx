import useTranslation from "@/hooks/useTranslation";
import {
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa";
import { FormatPrice } from "./PriceTag";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

type OrderSummaryItemProps = {
  label: string;
  value?: string;
  children?: React.ReactNode;
};

const OrderSummaryItem = (props: OrderSummaryItemProps) => {
  const { label, value, children } = props;

  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode("gray.600", "gray.400")}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

export const CartOrderSummary = (props: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [UID, setUID] = useState("");
  const reduxData = useSelector((state: any) => state.icon);
  const currencyData = reduxData.currency ? reduxData.currency : "USD"

  useEffect(() => {
    setUID(localStorage.getItem("userId"))
  }, [])

  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Heading size="md" fontWeight="normal">{t("ShoppingCart.OrderSummary")}</Heading>

      <Stack spacing="6">
        <OrderSummaryItem
          label={t("ShoppingCart.Subtotal")}
          value={FormatPrice(currencyData == "USD" ? props.USDSubTotal : props.AEDSubTotal)}
        />
        {/* <OrderSummaryItem label="Shipping + Tax"> */}
        {/* <Link href="#" textDecor="underline"> */}
        {/* Calculate shipping */}
        {/* </Link> */}
        {/* </OrderSummaryItem> */}
        {/* <OrderSummaryItem label="Coupon Code">
          <Link href="#" textDecor="underline">
            Add coupon code
          </Link>
        </OrderSummaryItem> */}
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            {t("ShoppingCart.Total")}
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {FormatPrice(currencyData == "USD" ? props.USDTotal : props.AEDTotal)}
          </Text>
        </Flex>
      </Stack>
      <Button
        colorScheme="blue"
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
        className="btn"
        fontWeight={"normal"}
        onClick={() => UID ?
          props.carts.products &&
            props.carts.products.length == 0 || props.carts.products == undefined ?
            toast.error(t("ShoppingCart.EmptyToastMsg")) :
            router.push("/checkout") :
          router.push("/login") && toast.error(t("NewArrival.LoginMsg"))
        }
      >
        {t("ShoppingCart.Checkout")}
      </Button>
    </Stack>
  );
};
