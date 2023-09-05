import { db } from "@/firebase/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem } from "./CartItem";
import { CartOrderSummary } from "./CartOrderSummary";
import blankImg from "@/assets/empty.svg";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/store";
import { toast } from "react-hot-toast";

export const ShopingCart = () => {
  const [userId, setUserId] = useState<string>('');
  const [carts, setCarts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [userDocId, setUserDocId] = useState();
  const [cartColID, setCartColID] = useState('')
  const [isDisable, setIsDisable] = useState(false)
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reduxData = useSelector((state: any) => state.icon);

  useEffect(() => {
    const isEmptyObject = (obj: any) => {
      return Object.keys(obj).length === 0;
    };

    if (!userId) {
      if (!isEmptyObject(reduxData?.cart)) {
        setCarts(reduxData?.cart);
        setLoading(false);
      }
      else {
        setCarts({
          AEDTotal: 0,
          AEDSubTotal: 0,
          USDTotal: 0,
          USDSubTotal: 0,
          products: []
        })
      }
    }
    setLoading(false);
  }, [userId, reduxData])

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    if (userId) {
      fetchCartData();
    }
  }, [userId])

  const fetchCartData = async () => {
    const SupplierQuery = query(
      collection(db, "storeUsers"),
      where("id", "==", userId)
    );
    await onSnapshot(SupplierQuery, (userSnapshot: any) => {
      setUserDocId(userSnapshot.docs[0]?.id)
      const docId = userSnapshot.docs[0]?.id
      const newdocRef = collection(db, "storeUsers", docId, "cart");
      onSnapshot(newdocRef, (querydata) => {
        querydata.docs.map((item) => {
          setCartColID(item.id)
          setCarts({ ...item.data(), id: item.id });
          console.log("item.data()", item.data());
        })
        setLoading(false);
      });
    })
  }

  const onClickDelete = async (value: number) => {
    setIsDisable(true)
    let productData = carts.products[value]
    let AEDeTotalPrice = productData.variantInfo.ChooseQty * productData.variantInfo.selectedVariantPrice.AEDPrice
    let USDeTotalPrice = productData.variantInfo.ChooseQty * productData.variantInfo.selectedVariantPrice.USDPrice
    let newCartdata = carts.products.filter((data: any, index: number) => index !== value)

    setCarts({
      AEDTotal: carts.AEDTotal - AEDeTotalPrice,
      AEDSubTotal: carts.AEDSubTotal - AEDeTotalPrice,
      USDTotal: carts.USDTotal - USDeTotalPrice,
      USDSubTotal: carts.USDSubTotal - USDeTotalPrice,
      products: newCartdata
    })

    if (userId) {
      const newRef = doc(db, "storeUsers", userDocId, "cart", cartColID)
      await updateDoc(newRef, {
        AEDTotal: carts.AEDTotal - AEDeTotalPrice,
        AEDSubTotal: carts.AEDSubTotal - AEDeTotalPrice,
        products: newCartdata,
        USDTotal: carts.USDTotal - USDeTotalPrice,
        USDSubTotal: carts.USDSubTotal - USDeTotalPrice
      }).then(() => {
        setIsDisable(false)
        toast.success(t("ShoppingCart.RemoveToastMsg"));
      })
    } else {
      let cartInfo = {
        AEDTotal: carts.AEDTotal - AEDeTotalPrice,
        AEDSubTotal: carts.AEDSubTotal - AEDeTotalPrice,
        products: newCartdata,
        USDTotal: carts.USDTotal - USDeTotalPrice,
        USDSubTotal: carts.USDSubTotal - USDeTotalPrice
      }
      dispatch(setCart(cartInfo))
      setIsDisable(false)
      localStorage.setItem("cartData", JSON.stringify(cartInfo))
    }
  }

  return (
    <>
      {loading ? (
        <>
          <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
            <Spinner />
          </Flex>
        </>
      ) : (
        <>
          <Box
            maxW={{ base: "3xl", lg: "7xl" }}
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
          >
            <Stack
              direction={{ base: "column", lg: "row" }}
              align={{ lg: "flex-start" }}
              spacing={{ base: "8", md: "16" }}
            >
              <Stack spacing={{ base: "8", md: "10" }} flex="2">
                <Heading fontSize="2xl" fontWeight="normal">
                  {t("ShoppingCart.title")} ({carts?.products?.length} {t("ShoppingCart.items")})
                </Heading>
                {
                  carts.products?.length != 0 ? (
                    <Stack spacing="6">
                      {carts && carts.products?.map((item: any, index: number) => (
                        <CartItem key={Math.random()}
                          {...item}
                          userDocid={userDocId}
                          cartDocId={carts.id}
                          cardData={carts}
                          index={index}
                          onDelete={onClickDelete}
                          isDisable={isDisable}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <>
                      <Flex justifyContent={"center"}>
                        <Image src={blankImg} alt="blank img" width={300} height={300} />
                      </Flex>
                      <Flex alignItems={"center"} flexDirection={"column"}>
                        <Text fontSize={"lg"}>{t("ShoppingCart.ProductNotFound")}</Text>
                        <Button variant={"ghost"} color={"primaryColor"}
                          onClick={() => router.push("/allproducts")}>
                          {t("ShoppingCart.AllProducts")}
                        </Button>
                      </Flex>
                    </>
                  )
                }
              </Stack>

              <Flex direction="column" align="center" flex="1">
                <CartOrderSummary
                  key={"Summery "}
                  carts={carts}
                  AEDSubTotal={carts.AEDSubTotal}
                  AEDTotal={carts.AEDTotal}
                  USDSubTotal={carts.USDSubTotal}
                  USDTotal={carts.USDTotal}
                  userDocid={userDocId} />
                <HStack mt="6" fontWeight="semibold">
                  <p style={{ color: "#8b8b8b" }}>{t("ShoppingCart.or")}</p>
                  <Link
                    color="primaryColor"
                    href="/"
                  >
                    {t("ShoppingCart.ContinueShopping")}
                  </Link>
                </HStack>
              </Flex>
            </Stack>
          </Box>
        </>
      )}
    </>
  );
}
