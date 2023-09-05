import { db } from "@/firebase/client";
import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Center,
  Flex,
  Stack,
  Text,
  useColorModeValue as mode,
  useToken,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

type NavActionProps = {
  href?: string;
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
};

const MobileNavAction = (props: NavActionProps) => {
  const { label, icon, href } = props;

  const blue500 = useToken("colors", "blue.500");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, [userId]);

  return (
    <Center
      onClick={() => label == "Cart" ? router.push(href) : userId ? router.push(href) : router.push("/login")}
      height="3.5rem"
      rounded="4"
      aria-current={href == router.pathname ? "page" : undefined}
      _activeLink={{
        bg: mode("blue.50", transparentize(blue500, 0.2)),
        color: "primaryColor",
      }}
      width={"100%"}
      textAlign='center'
      display={'flex'}
      justifyContent={'center'}
      _hover={{ bg: mode("gray.100", "gray.700") }}
    >
      <Stack direction="column" align="center" justify={'center'} as="button" spacing="0">
        <Box fontSize="xl" as={icon} />
      </Stack>
    </Center>
  );
};

const DesktopNavAction = (props: NavActionProps) => {
  const { label, icon, isActive, href } = props;
  const [userId, setUserId] = useState<string>("");
  const [carts, setCarts] = useState<any>({});
  const [BlockShow, setBlockShow] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const reduxData = useSelector((state: any) => state.icon);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    if (userId) {
      fetchCartData();
    } else {
      if (reduxData?.cart) {
        setCarts(reduxData.cart);
      }
    }
  }, [userId, reduxData]);

  const fetchCartData = async () => {
    const SupplierQuery = query(
      collection(db, "storeUsers"),
      where("id", "==", userId)
    );
    await onSnapshot(SupplierQuery, (userSnapshot: any) => {
      const docId = userSnapshot.docs[0]?.id;
      if (docId) {
        const newdocRef = collection(db, "storeUsers", docId, "cart");
        onSnapshot(newdocRef, (querydata) => {
          querydata.docs.map((item) => {
            setCarts({ ...item.data(), id: item.id });
          });
        });
      }
    });
  };

  return (
    <>
      <Center
        w="8"
        h="8"
        as="a"
        cursor={"pointer"}
        onClick={() => label == "Cart" ? router.push(href) : userId ? router.push(href) : router.push("/login")}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={() =>
          label == "Cart" && carts.products && carts.products.length != 0
            ? setBlockShow(true)
            : setBlockShow(false)
        }
      >
        <Box
          focusable="false"
          fontSize="xl"
          as={icon}
          color={mode("gray.600", "gray.300")}
          position="absolute"
        />
        <Box
          overflowY={"auto"}
          display={BlockShow ? "block" : "none"}
          className="cartBox"
          padding={3}
          onMouseLeave={() => setBlockShow(false)}
          top={20}
          right={{ lg: "1rem", xl: "1rem", '2xl': "10rem" }}
          position="absolute"
          bg={"#fff"}
          width={"350px"}
          height={
            carts.products && carts.products.length < 3 ? "auto" : "190px"
          }
          boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
        >
          {carts &&
            carts.products?.map((item: any, index: number) => (
              <Flex
                mt={index == 0 ? 0 : 5}
                ml={2}
                key={index}
                flexDirection={"row"}
                gap={3}
                alignItems={"center"}
              >
                <Image
                  width={50}
                  height={50}
                  src={item.variantInfo.img == "" ? item.mainImage : item.variantInfo.img}
                  // src={item.mainImage}
                  alt=""
                  draggable="false"
                  loading="lazy"
                />
                <Flex gap={4} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
                  <Flex flexDirection={"column"}>
                    <Text fontWeight="normal" fontSize={"md"}>
                      {(item.ProductName && item.ProductName[locale])
                        .split(" ")
                        .slice(0, 2)
                        .join(" ") + "..."}
                    </Text>
                    <Text fontWeight="normal" fontSize={"small"} me={5}>
                      {t("ShoppingCart.Qty")}: {item.variantInfo?.ChooseQty}
                    </Text>
                  </Flex>
                  <Flex flexWrap={"wrap"} gap={3}>
                    <Text
                      bg={"#EDF2F7"}
                      borderRadius={"20%"}
                      padding={"3px"}
                      fontWeight="normal"
                      fontSize={"small"}
                      display={item.variantInfo.selectedSize ? "block" : "none"}
                    >
                      {item.variantInfo.selectedSize}
                    </Text>
                    <Text
                      bg={"#EDF2F7"}
                      borderRadius={"20%"}
                      padding={"3px"}
                      fontWeight="normal"
                      fontSize={"small"}
                      display={item.variantInfo.selectedColor ? "block" : "none"}
                    >
                      {item.variantInfo.selectedColor}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}
        </Box>
        {label == "Cart" && carts.products && carts.products.length != 0 ? (
          <>
            <Text
              bg="primaryColor"
              fontSize={"13px"}
              borderRadius={"50%"}
              color="#fff"
              position={"relative"}
              top={"-1em"}
              right={"-0.9em"}
              padding={"0.1em 0.5em"}
            >
              {carts?.products?.length}
            </Text>
          </>
        ) : null}
      </Center>
    </>
  );
};

export const NavAction = {
  Mobile: MobileNavAction,
  Desktop: DesktopNavAction,
};
