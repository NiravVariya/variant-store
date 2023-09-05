import React from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Icon,
    useColorModeValue as mode,
    VisuallyHidden,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    ModalFooter,
    flexbox,
    Select,
    Stack,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { NavLayout } from "../MobileNavWithAccordion/NavLayout";
import { MdMenu, MdSearch, MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { FiSearch } from 'react-icons/fi'
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { setCurrency, setMobileSearch } from "@/store";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import USAFlage from "../../assets/image 28.png";
import UAEFlage from "../../assets/image 29.png";

const MobileNavHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [languageValue, setLanguageValue] = useState("");
    const [currencyValue, setCurrencyValue] = useState("");
    const [allproducts, setAllproducts] = useState<any[]>([]);
    const [searchList, setSearchList] = useState<any>("");
    const [categories, setCategories] = useState<any[]>([]);
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { locale } = useRouter();

    const reduxData = useSelector((state: any) => state.icon);
    const [storeDocId, setStoreDocId] = useState("")
    const [currencyData, setCurrencyData] = useState("")

    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap) => {
        settingSnap.docs.map((value: any) => {
            const dataref: any = doc(db, "storeSetting", value.id);
            setStoreDocId(dataref.id);
        });
    });

    useEffect(() => {
        if (storeDocId) {
            const newdocRef = collection(db, "storeSetting", storeDocId, "Currencies");
            onSnapshot(newdocRef, (querydata) => {
                setCurrencyData(querydata?.docs[0]?.data().mainCurrency)
            });
        }
    }, [storeDocId])

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

    useEffect(() => {
        const filteredProducts = allproducts.filter((product) => {
            if (
                product.ProductName[locale].toLowerCase().includes(searchList)
            ) {
                dispatch(setMobileSearch(searchList));
                return product;
            }
        });

        const filteredCategory = categories.filter((categorie) => {
            if (
                categorie.category[locale].toLowerCase().includes(searchList)
            ) {
                dispatch(setMobileSearch(searchList));
                return categorie;
            }
        });
    }, [searchList])

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
            setLanguageValue("🇺🇸 EN")
        } else {
            setLanguageValue("🇦🇪 AR")
        }
    }, [])

    return (
        <>
            <Flex
                px="4"
                py="4"
                align="center"
                justify="space-between"
                display={{ base: "flex", lg: "none" }}
                bg="bg-surface"
            >
                <HStack spacing="3">
                    <Center w="8" h="8" as="button" type="button" onClick={onOpen}>
                        <VisuallyHidden>Toggle Menu</VisuallyHidden>
                        <Box as={MdMenu} fontSize="3xl" />
                    </Center>
                    <Link href="/" rel="home" aria-label="Go to Store Homepage">
                        <Image src='/images/logo.jpg' alt="blank img" width={70} height={16} />
                    </Link>
                </HStack>
                <HStack align={"center"}>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<MdKeyboardArrowDown />}
                            bgColor={"#fff"}
                            fontWeight="medium"
                            _active={{ bgColor: "#fff", border: "1px" }}
                            _hover={{ bgColor: "#fff", border: "1px", borderColor: "#E3E3E3", borderRedius: "8px" }}
                            onClick={(e) => router.push(router.asPath, router.asPath)}
                            value={router.locale}
                        >
                            {languageValue}
                        </MenuButton>
                        <MenuList>
                            <MenuGroup title='Language'>
                                <MenuItem
                                    minH='48px'
                                    as={Link}
                                    href={router.asPath}
                                    locale="en"
                                    onClick={(e) => setLanguageValue("🇺🇸 EN")}
                                >
                                    <Flex flexDirection={"row"} gap={4}>
                                        <Image
                                            src={USAFlage}
                                            alt='English - EN'
                                            width={30}
                                            height={30}
                                            unoptimized
                                        />
                                        <Text>English - EN</Text>
                                    </Flex>
                                </MenuItem>
                                <MenuItem
                                    minH='40px'
                                    as={Link}
                                    href={router.asPath}
                                    locale="ar"
                                    onClick={(e) => setLanguageValue("🇦🇪 AR")}
                                >
                                    <Flex flexDirection={"row"} gap={4}>
                                        <Image
                                            src={UAEFlage}
                                            alt='العربية- AR'
                                            width={30}
                                            height={30}
                                            unoptimized
                                        />
                                        <Text>العربية- AR</Text>
                                    </Flex>
                                </MenuItem>
                            </MenuGroup>
                            <MenuDivider />
                            <MenuGroup title='Currency'>
                                <Menu>
                                    <MenuButton
                                        ml={0.5}
                                        gap={"124px"}
                                        as={Button}
                                        rightIcon={<MdKeyboardArrowDown />}
                                        bgColor={"#fff"}
                                        fontWeight="medium"
                                        _active={{ bgColor: "#fff", border: "1px" }}
                                        _hover={{ bgColor: "#fff", border: "1px", borderColor: "#E3E3E3", borderRedius: "8px" }}
                                        value={currencyValue}
                                    // onClick={(e) => {
                                    //     setCurrencyValue(e.target.value);
                                    // }}
                                    >
                                        {currencyValue}
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => {
                                            setCurrencyValue("USD")
                                            dispatch(setCurrency("USD"));
                                            localStorage.setItem("currency", "USD");
                                        }}>
                                            USD
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            setCurrencyValue(currencyData ? currencyData : "AED")
                                            dispatch(setCurrency(currencyData ? currencyData : "AED"));
                                            localStorage.setItem("currency", currencyData ? currencyData : "AED");
                                        }}>
                                            {currencyData ? currencyData : "AED"}
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </MenuGroup>
                        </MenuList>
                    </Menu>

                </HStack>
            </Flex>
            <Stack bg="bg-surface">
                <InputGroup
                    maxW={"sm"}
                    mx={"auto"}
                    paddingBottom={5}
                    display={{ base: "block", lg: "none" }}
                >
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="muted" boxSize="5" />
                    </InputLeftElement>
                    <Input
                        placeholder={t('Nav.Search')}
                        _focus={{ borderColor: "primaryColor" }}
                        value={searchList}
                        onFocus={(e) => {
                            (router.pathname !== "/allproducts" && router.pathname !== "/categories") ? router.push("/allproducts") : null
                        }}
                        onChange={(e) => {
                            setSearchList(e.target.value)
                        }}
                    />
                </InputGroup>
            </Stack>

            <Box display={{ base: "flex", lg: "none" }}>
                <Box as="nav">
                    <NavLayout onClickMenu={onOpen} isMenuOpen={isOpen} />
                    <Drawer
                        placement="left"
                        initialFocusRef={menuButtonRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    // size="lg"
                    >
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerHeader>
                                <HStack mt="6" justifyContent={"flex-end"}>
                                    <Button onClick={onClose} variant="ghost" fontSize={"25px"} fontWeight="semibold">
                                        <RxCross1 />
                                    </Button>
                                </HStack>
                                <NavLayout onClickMenu={onClose} isMenuOpen={isOpen} menuButtonRef={menuButtonRef} />
                            </DrawerHeader>
                            <DrawerBody>
                                <ButtonGroup display={"flex"} variant="ghost" spacing="1" flexDirection={"column"} >
                                    <Button
                                        fontWeight={"normal"}
                                        color={router.pathname === "/" ? "primaryColor" : "#8b8b8b"}
                                        _hover={{ color: "primaryColor" }}
                                        onClick={() => router.push("/")}
                                        fontSize={"20px"}
                                        height='3em'
                                    >
                                        {t('Nav.Home')}
                                    </Button>
                                    <Button
                                        fontWeight={"normal"}
                                        color={router.pathname === "/aboutus" ? "primaryColor" : "#8b8b8b"}
                                        _hover={{ color: "primaryColor" }}
                                        onClick={() => router.push("/aboutus")}
                                        fontSize={"20px"}
                                        height='3em'
                                    >
                                        {t("Nav.AboutAs")}
                                    </Button>
                                    <Button
                                        fontWeight={"normal"}
                                        color={
                                            router.pathname === "/allproducts"
                                                ? "primaryColor"
                                                : "#8b8b8b"
                                        }
                                        _hover={{ color: "primaryColor" }}
                                        onClick={() => router.push("/allproducts")}
                                        fontSize={"20px"}
                                        height='3em'
                                    >
                                        {t('Nav.AllProducts')}
                                    </Button>
                                    <Button
                                        fontWeight={"normal"}
                                        color={
                                            router.pathname === "/mostselling"
                                                ? "primaryColor"
                                                : "#8b8b8b"
                                        }
                                        _hover={{ color: "primaryColor" }}
                                        onClick={() => router.push("/mostselling")}
                                        fontSize={"20px"}
                                        height='3em'
                                    >
                                        {t('Nav.MostSelling')}
                                    </Button>
                                    <Button
                                        fontWeight={"normal"}
                                        color={
                                            router.pathname === "/categories"
                                                ? "primaryColor"
                                                : "#8b8b8b"
                                        }
                                        _hover={{ color: "primaryColor" }}
                                        onClick={() => router.push("/categories")}
                                        fontSize={"20px"}
                                        height='3em'
                                    >
                                        {t('Nav.Categories')}
                                    </Button>
                                </ButtonGroup>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Box>
            </Box>
        </>
    );
};

export default MobileNavHeader;