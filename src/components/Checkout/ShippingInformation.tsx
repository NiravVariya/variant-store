import { db } from "@/firebase/client";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
// import { checkout } from './checkout';
import useTranslation from "@/hooks/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import PayPalCheckoutButton from "./paypal";
import { setOrderData } from "@/store";
import { useRouter } from "next/router";
import { PaymentOptionList } from "./PaymentOptionList";
import { StripeCheckout } from "./StripeCheckout";

export const ShippingInformation = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [userDocId, setUserDocId] = useState("");
  const [UID, setUID] = useState("");
  const [carts, setCarts] = useState<any>({});
  const [errorName, setErrorName] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorzipCode, setErrorzipCode] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorMobileNo, setErrorMobileNo] = useState("");
  const [isAddress, setIsAdderss] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const reduxData = useSelector((state: any) => state.icon);
  const stripeKey = reduxData.storeSetData.stripyKey;
  const currencyData = reduxData.currency ? reduxData.currency : "USD";

  useEffect(() => {
    setUID(localStorage.getItem("userId"));
    if (UID) {
      fetchCartData();
    }
  }, [UID]);

  const fetchCartData = async () => {
    const SupplierQuery = query(
      collection(db, "storeUsers"),
      where("id", "==", UID)
    );
    await onSnapshot(SupplierQuery, (userSnapshot: any) => {
      const docId = userSnapshot.docs[0].id;
      setUserDocId(userSnapshot.docs[0].id);
      const newdocRef = collection(db, "storeUsers", docId, "cart");
      onSnapshot(newdocRef, (querydata) => {
        querydata.docs.map((item) => {
          setCarts({ ...item.data(), id: item.id });
        });
      });
    });
  };

  const addOrderDetails = async () => {
    if (name === "") {
      setErrorName(t("CheckOut.NameValidation"));
    } else if (address === "") {
      setErrorAddress(t("CheckOut.AddressValidation"));
    } else if (zipCode === "") {
      setErrorzipCode(t("CheckOut.ZipCodeValidation"));
    } else if (city === "") {
      setErrorCity(t("CheckOut.CityValidation"));
    } else if (email === "") {
      setErrorEmail(t("CheckOut.EmailValidation"));
    } else if (mobileNo === "") {
      setErrorMobileNo(t("CheckOut.NumberValidation"));
    } else {
      const placedOrder: any = await addDoc(collection(db, "Orders"), {
        name: name,
        address: address,
        zipCode: zipCode,
        city: city,
        email: email,
        mobileNo: mobileNo,
        userRef: doc(db, "storeUsers", userDocId),
        paymentStatus: "Pending",
        paymentWith: "",
        orderStatus: "Placed",
        OrderDate: serverTimestamp(),
        ...carts,
      });
      toast.success(t("Shipping.information.ToastMsg"));
      setIsAdderss(true);
      dispatch(setOrderData(carts));
      localStorage.setItem("orderID", placedOrder.id);
    }
  };

  const handleCashOnDelivery = async () => {
    toast.success(t("Shipping.information.OrderToast"));
    router.push(`/confirmorder?paymentStatus=Cashondelivery`);
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrorEmail(t("CheckOut.EmailErrorMsg"));
    } else {
      setErrorEmail("");
    }
  };

  return (
    <Stack spacing={{ base: "6", md: "10" }}>
      {isAddress == false ? (
        <>
          <Heading size="md">{t("CheckOut.title")}</Heading>
          <Stack spacing={{ base: "6", md: "8" }}>
            <FormControl id="name">
              <FormLabel>{t("CheckOut.FullName")}</FormLabel>
              <Input
                name="name"
                placeholder={t("CheckOut.FullNameInput")}
                borderColor={errorName ? "red" : null}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorName("");
                }}
              />
              {errorName && (
                <FormHelperText color={"red"}>{errorName}</FormHelperText>
              )}
            </FormControl>
            <FormControl id="street">
              <FormLabel>{t("CheckOut.StreetAddress")}</FormLabel>
              <Input
                name="address"
                placeholder={t("CheckOut.StreetAddressInput")}
                borderColor={errorAddress ? "red" : null}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrorAddress("");
                }}
              />
              {errorAddress && (
                <FormHelperText color={"red"}>{errorAddress}</FormHelperText>
              )}
            </FormControl>
            <HStack spacing="6">
              <FormControl id="zip" maxW="auto">
                <FormLabel>{t("CheckOut.ZipCode")}</FormLabel>
                <Input
                  name="zip"
                  placeholder={t("CheckOut.ZipCodeInput")}
                  borderColor={errorzipCode ? "red" : null}
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setErrorzipCode("");
                  }}
                />
                {errorzipCode && (
                  <FormHelperText color={"red"}>{errorzipCode}</FormHelperText>
                )}
              </FormControl>
              <FormControl id="city">
                <FormLabel>{t("CheckOut.City")}</FormLabel>
                <Input
                  name="city"
                  placeholder={t("CheckOut.CityInput")}
                  borderColor={errorCity ? "red" : null}
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setErrorCity("");
                  }}
                />
                {errorCity && (
                  <FormHelperText color={"red"}>{errorCity}</FormHelperText>
                )}
              </FormControl>
            </HStack>
            <FormControl id="email">
              <FormLabel>{t("CheckOut.EmailAddress")}</FormLabel>
              <Input
                name="email"
                placeholder={t("CheckOut.EmailAddress")}
                borderColor={errorEmail ? "red" : null}
                value={email}
                onChange={handleEmailChange}
              />
              {errorEmail && (
                <FormHelperText color={"red"}>{errorEmail}</FormHelperText>
              )}
            </FormControl>
            <FormControl id="phone">
              <FormLabel>{t("CheckOut.MobileNo")}</FormLabel>
              <Input
                name="phone"
                type="number"
                placeholder={t("CheckOut.MobileNo")}
                borderColor={errorMobileNo ? "red" : null}
                value={mobileNo}
                onChange={(e) => {
                  setMobileNo(e.target.value);
                  setErrorMobileNo("");
                }}
              />
              {errorMobileNo && (
                <FormHelperText color={"red"}>{errorMobileNo}</FormHelperText>
              )}
            </FormControl>
            <Stack spacing="8">
              <Button
                className="btn"
                colorScheme="blue"
                size="lg"
                py="7"
                onClick={() => {
                  addOrderDetails();
                }}
              >
                {t("CheckOut.PlaceOrder")}
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <>
          <PaymentOptionList cartData={carts} orderId={localStorage.getItem('orderID')} />
          <Button
            variant="ghost"
            border="1px"
            borderColor={"primaryColor"}
            colorScheme="blue"
            textColor={"primaryColor"}
            size="lg"
            py="7"
            onClick={() => {
              handleCashOnDelivery();
            }}
          >
            {t("CheckOut.CashOnDelivery")}
          </Button>
        </>
      )}
    </Stack>
  );
};
