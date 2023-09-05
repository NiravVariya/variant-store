import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue as mode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown, MdMenu, MdSearch } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { items } from "./NavItemIcons";
import { NavAction } from "./NavAction";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { NavLayout } from "../MobileNavWithAccordion/NavLayout";
import { NavAccordion } from "../MobileNavWithAccordion/NavAccordion";
import { data } from "../MobileNavWithAccordion/data";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useDispatch, useSelector } from "react-redux";
import { setSearch, setCurrency, setSortValue, setCleardata } from "@/store";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import USAFlage from "../../assets/image 28.png";
import UAEFlage from "../../assets/image 29.png";

const DesktopNavHeader = () => {
  const [allproducts, setAllproducts] = useState<any[]>([]);
  const [searchList, setSearchList] = useState<any>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [languageValue, setLanguageValue] = useState("");
  const [currencyValue, setCurrencyValue] = useState("");
  const reduxData = useSelector((state: any) => state.icon);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { locale } = useRouter();

  useEffect(() => {
    const fetchAllProducts = async () => {
      const productsQuery = collection(db, "storeProducts");
      await onSnapshot(productsQuery, (productsSnapshot) => {
        const productsArr: any[] = [];
        productsSnapshot.docs.map((products) => {
          const productsdata = products.data();
          productsArr.push({ ...productsdata, id: products.id });
        });
        setAllproducts(productsArr);
      });
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const filteredProducts = allproducts.filter((product) => {
      if (product.ProductName[locale].toLowerCase().includes(searchList)) {
        dispatch(setSearch(searchList));
        return product;
      }
    });

    const filteredCategory = categories.filter((categorie) => {
      if (categorie.category[locale].toLowerCase().includes(searchList)) {
        dispatch(setSearch(searchList));
        return categorie;
      }
    });
  }, [searchList])

  useEffect(() => {
    const fetchAllCategories = async () => {
      const categoryQuery = collection(db, "Categories");
      await onSnapshot(categoryQuery, (categorySnapshot) => {
        const categoryarr: any[] = [];
        categorySnapshot.docs.map((category) => {
          const categorydata = category.data();
          categoryarr.push(categorydata);
        });
        setCategories(categoryarr);
      });
    };
    fetchAllCategories();
  }, []);

  const [storeDocId, setStoreDocId] = useState("");
  const [currencyData, setCurrencyData] = useState("");

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap) => {
    settingSnap.docs.map((value: any) => {
      const dataref: any = doc(db, "storeSetting", value.id);
      setStoreDocId(dataref.id);
    });
  });

  useEffect(() => {
    if (storeDocId) {
      const newdocRef = collection(
        db,
        "storeSetting",
        storeDocId,
        "Currencies"
      );
      onSnapshot(newdocRef, (querydata) => {
        setCurrencyData(querydata?.docs[0]?.data().mainCurrency);
      });
    }
  }, [storeDocId]);

  useEffect(() => {
    let dir = router.locale == "ar" ? "rtl" : "ltr";
    let lang = router.locale == "ar" ? "ar" : "en";
    document.querySelector("html").setAttribute("dir", dir);
    document.querySelector("html").setAttribute("lang", lang);
  }, [router?.locale]);

  useEffect(() => {
    const fetchCurrency = localStorage.getItem("currency");
    if (fetchCurrency !== "" && fetchCurrency !== null) {
      setCurrencyValue(fetchCurrency);
    } else {
      setCurrencyValue("USD");
    }
    localStorage.setItem("currency", fetchCurrency ? fetchCurrency : "USD");
  }, []);

  useEffect(() => {
    if (locale == "en") {
      setLanguageValue("🇺🇸 EN");
    } else {
      setLanguageValue("🇦🇪 AR");
    }

  }, []);

  const clearSortValue = () => {
    dispatch(setCleardata(""));
  };

  return (
    <Box
      bg={mode("white", "gray.800")}
      padding={"0.5rem"}
      display={{ base: "none", lg: "block" }}
    >
      <Flex justify="space-evenly" align="center" maxWidth="8xl" mx="auto">
        <HStack
          role="navigation"
          aria-label="Main navigation"
          spacing="10"
          fontWeight="normal"
          fontSize="sm"
        >
          <Link href="/" rel="home" aria-label="Go to Store Homepage">
            <Image
              src='/images/logo.jpg'
              alt="blank img"
              height={15}
              width={70}
            />
          </Link>
          <ButtonGroup variant="ghost" spacing="1">
            <Button
              fontWeight={"normal"}
              color={router.pathname === "/" ? "primaryColor" : "#8b8b8b"}
              _hover={{ color: "primaryColor" }}
              onClick={() => {
                router.push("/");
                clearSortValue();
              }}
              fontSize={{ md: "1rem", xl: "1.2rem" }}
            >
              {t("Nav.Home")}
            </Button>
            <Button
              fontWeight={"normal"}
              color={router.pathname === "/aboutus" ? "primaryColor" : "#8b8b8b"}
              _hover={{ color: "primaryColor" }}
              onClick={() => {
                router.push("/aboutus");
                clearSortValue();
              }}
              fontSize={{ md: "1rem", xl: "1.2rem" }}
            >
              {t("Nav.AboutAs")}
            </Button>
            <Button
              fontWeight={"normal"}
              color={
                router.pathname === "/allproducts" ? "primaryColor" : "#8b8b8b"
              }
              _hover={{ color: "primaryColor" }}
              onClick={() => {
                router.push("/allproducts");
                clearSortValue();
              }}
              fontSize={{ md: "1rem", xl: "1.2rem" }}
            >
              {t("Nav.AllProducts")}
            </Button>
            <Button
              fontWeight={"normal"}
              color={
                router.pathname === "/mostselling" ? "primaryColor" : "#8b8b8b"
              }
              _hover={{ color: "primaryColor" }}
              onClick={() => {
                router.push("/mostselling");
                clearSortValue();
              }}
              fontSize={{ md: "1rem", xl: "1.2rem" }}
            >
              {t("Nav.MostSelling")}
            </Button>
            <Button
              fontWeight={"normal"}
              color={
                router.pathname === "/categories" ? "primaryColor" : "#8b8b8b"
              }
              _hover={{ color: "primaryColor" }}
              onClick={() => {
                router.push("/categories");
                clearSortValue();
              }}
              fontSize={{ md: "1rem", xl: "1.2rem" }}
            >
              {t("Nav.Categories")}
            </Button>
          </ButtonGroup>
        </HStack>
        <HStack spacing="4">
          <InputGroup maxW="xs" width={{ base: 100, md: 110, xl: 250 }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder={t("Nav.Search")}
              value={searchList}
              onFocus={(e) => {
                router.pathname !== "/allproducts" &&
                  router.pathname !== "/categories"
                  ? router.push("/allproducts")
                  : null;
              }}
              onChange={(e) => {
                setSearchList(e.target.value);
              }}
            />
          </InputGroup>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<MdKeyboardArrowDown />}
              bgColor={"#fff"}
              fontWeight="medium"
              _active={{ bgColor: "#fff", border: "1px" }}
              _hover={{
                bgColor: "#fff",
                border: "1px",
                borderColor: "#E3E3E3",
                borderRedius: "8px",
              }}
              onClick={(e) => {
                router.push(
                  router.asPath,
                  router.asPath
                  // { locale: e.target.value }
                );
              }}
              value={router.locale}
            >
              {languageValue}
            </MenuButton>
            <MenuList>
              <MenuGroup title="Language">
                <MenuItem
                  minH="48px"
                  as={Link}
                  href={router.asPath}
                  locale="en"
                  onClick={(e) => setLanguageValue("🇺🇸 EN")}
                >
                  <Flex flexDirection={"row"} gap={4}>
                    <Image
                      src={USAFlage}
                      alt="English - EN"
                      width={30}
                      height={30}
                      unoptimized
                    />
                    <Text>English - EN</Text>
                  </Flex>
                </MenuItem>
                <MenuItem
                  minH="40px"
                  as={Link}
                  href={router.asPath}
                  locale="ar"
                  onClick={(e) => setLanguageValue("🇦🇪 AR")}
                >
                  <Flex flexDirection={"row"} gap={4}>
                    <Image
                      src={UAEFlage}
                      alt="العربية- AR"
                      width={30}
                      height={30}
                      unoptimized
                    />
                    <Text>العربية- AR</Text>
                  </Flex>
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Currency">
                <Menu>
                  <MenuButton
                    ml={0.5}
                    gap={"124px"}
                    as={Button}
                    rightIcon={<MdKeyboardArrowDown />}
                    bgColor={"#fff"}
                    fontWeight="medium"
                    _active={{ bgColor: "#fff", border: "1px" }}
                    _hover={{
                      bgColor: "#fff",
                      border: "1px",
                      borderColor: "#E3E3E3",
                      borderRedius: "8px",
                    }}
                    value={currencyValue}
                  // onClick={(e) => {
                  //   setCurrencyValue(e.target.value);
                  // }}
                  >
                    {currencyValue}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setCurrencyValue("USD");
                        dispatch(setCurrency("USD"));
                        localStorage.setItem("currency", "USD");
                      }}
                    >
                      USD
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setCurrencyValue(currencyData ? currencyData : "AED");
                        dispatch(
                          setCurrency(currencyData ? currencyData : "AED")
                        );
                        localStorage.setItem(
                          "currency",
                          currencyData ? currencyData : "AED"
                        );
                      }}
                    >
                      {currencyData ? currencyData : "AED"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </MenuGroup>
            </MenuList>
          </Menu>

          <HStack spacing="4">
            {/* <NavAction.Desktop {...items.search} /> */}

            <NavAction.Desktop {...items.wishlist} />
            <NavAction.Desktop {...items.user} />
            <NavAction.Desktop {...items.cart} />
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export const NavHeader = {
  Desktop: DesktopNavHeader,
};