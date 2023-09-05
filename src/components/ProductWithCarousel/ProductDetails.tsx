import {
    Box,
    Button,
    Circle,
    Flex,
    Heading,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { PriceTag } from "./PriceTag";
import { QuantityPicker } from "./QuantityPicker";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    collection,
    query,
    onSnapshot,
    where,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "@/firebase/client";
import { Reviews } from "../Reviews/App";
import useTranslation from "@/hooks/useTranslation";
import { StarIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { setCart } from "@/store";
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

export const ProductDetails = () => {
    const router = useRouter();
    const { locale } = useRouter();
    const { productId }: any = router.query;
    const [productData, setProductData] = useState<any>({});
    const [userId, setUserId] = useState<string>("");
    const [CartData, setCartData] = useState<any>({});
    const [loading, setloading] = useState(false);
    const [cartloading, setCartloading] = useState(false);
    const [cartColID, setCartColID] = useState("");
    const [UID, setUID] = useState("");
    const [ProductImg, setProductImg] = useState([]);
    const [wishData, setWishData] = useState<any>([]);
    const [qtyValue, setQtyValue] = useState(1);
    const [variantName, setVariantName] = useState("")
    const [variantSize, setVariantSize] = useState("")
    const [variantColor, setVariantColor] = useState("")
    const [selectedVariantPrice, setSelectedVariantPrice] = useState<any>({})
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const reduxData = useSelector((state: any) => state.icon);
    const currencyData = localStorage.getItem("currency");
    const [combinedImages, setCombinedImages] = useState<string[]>([]);
    const [variantImg, setVariantImg] = useState("")
    const [activeIndex, setActiveIndex] = useState(0);

    const renderSlides = () => {
        return combinedImages.map((image: any, index: any) => (
            <div className="carousel-item" key={index}>
                <Image
                    src={image}
                    alt=""
                    width={50}
                    height={550}
                    style={{ width: "100%", height: "500px", objectFit: "contain" }}
                    unoptimized
                />
            </div>
        ));
    };

    useEffect(() => {
        setloading(true);
        setUID(localStorage.getItem("userId"));
        const fetchStoreDetail = async () => {
            if (productId) {
                const productRef = collection(db, "storeProducts");

                await onSnapshot(productRef, (productSnap) => {
                    productSnap.docs.map((res) => {
                        if (res.id === productId) {
                            setProductData({ ...res.data(), id: res.id });
                            setloading(true);
                            setProductImg(res.data().ProductImage);
                            const variantImages = res.data().variantCombination.reduce(
                                (acc: string[], variant: any) => {
                                    if (variant.varientCombination.Images) {
                                        return acc.concat(variant.varientCombination.Images);
                                    }
                                    return acc;
                                },
                                []
                            );
                            const allImages = [...res.data().ProductImage, ...variantImages];
                            setCombinedImages(allImages);
                            setloading(false);
                        }
                    });
                });
            }
        };
        fetchStoreDetail();
    }, [productId]);

    useEffect(() => {
        if (productData && productData.variants) {
            const firstColor: any = productData.variants.find(
                (option: any) => option.varientName === "color")?.subVarientList[0]?.name;
            if (firstColor) {
                setVariantColor(firstColor);
            }
        }
    }, [productData]);

    useEffect(() => {
        if (productData && productData.variants) {
            const firstSize = productData.variants.find(
                (option: any) => option.varientName === "size")?.subVarientList[0]?.name;
            if (firstSize) {
                setVariantSize(firstSize);
            }
        }
    }, [productData]);

    useEffect(() => {
        if (variantColor && variantSize) {
            const selectedVariant = productData.variantCombination?.find(
                (variant: any) =>
                    variant.varientCombination.color === variantColor &&
                    variant.varientCombination.size === variantSize
            )
            if (selectedVariant) {
                const selectedUSDPrice = selectedVariant.varientCombination.USDPrice;
                const selectedAEDPrice = selectedVariant.varientCombination.AEDPrice;

                setSelectedVariantPrice({ USDPrice: selectedUSDPrice, AEDPrice: selectedAEDPrice })
                let variantImage = selectedVariant.varientCombination?.Images[0] ?? "";
                setVariantImg(variantImage);
                const filterImage = combinedImages.findIndex((data) => data === variantImage)
                if (filterImage != -1) {
                    goToSlide(filterImage)
                }
            } else {
                console.log(`No USD price found for color ${variantColor}`);
            }
        }
        else if (variantSize) {
            const selectedVariant = productData.variantCombination?.find(
                (variant: any) => variant.varientCombination.size === variantSize
            )
            if (selectedVariant) {
                const selectedUSDPrice = selectedVariant.varientCombination.USDPrice;
                const selectedAEDPrice = selectedVariant.varientCombination.AEDPrice;

                setSelectedVariantPrice({ USDPrice: selectedUSDPrice, AEDPrice: selectedAEDPrice })
                let variantImage = selectedVariant?.varientCombination?.Images[0] ?? "";
                setVariantImg(variantImage);
                const filterImage = combinedImages.findIndex((data) => data === variantImage)
                if (filterImage != -1) {
                    goToSlide(filterImage)
                }
            } else {
                console.log(`No USD price found for size ${variantSize}`);
            }
        }
        else if (variantColor) {
            const selectedVariant = productData.variantCombination?.find(
                (variant: any) => variant.varientCombination.color === variantColor
            )
            if (selectedVariant) {
                const selectedUSDPrice = selectedVariant.varientCombination.USDPrice;
                const selectedAEDPrice = selectedVariant.varientCombination.AEDPrice;

                setSelectedVariantPrice({ USDPrice: selectedUSDPrice, AEDPrice: selectedAEDPrice })
                let variantImage = selectedVariant.varientCombination?.Images[0] ?? "";
                setVariantImg(variantImage);
                const filterImage = combinedImages.findIndex((data) => data == variantImage)
                if (filterImage != -1) {
                    goToSlide(filterImage)
                }
            } else {
                console.log(`No USD price found for color ${variantColor}`);
            }
        }
    }, [variantSize, variantColor, currencyData, productData])

    const goToSlide = (index: number) => {
        if (index >= 0 && index < combinedImages.length) {
            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const variants = productData?.variants;
        if (variants?.length == 1) {
            variants?.forEach((variant: any) => {
                const varientName = variant.varientName;
                console.log(`Variant Name: ${varientName}`);
                setVariantName(varientName)
            });
        }
    }, [productData])

    useEffect(() => {
        fetchReviewData();
    }, [productId])

    const fetchReviewData = async () => {
        if (productId) {
            const productRef = collection(db, "storeProducts", productId, "reviews");
            await onSnapshot(productRef, (productSnap) => {
                const reviewArray: any = [];
                productSnap.docs.map(async (res) => {
                    reviewArray.push({ ...res.data() })
                    const mappedArray = reviewArray.map((element: any) => element.startValue);
                    const startingAverage = mappedArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue) / mappedArray.length;
                    const docRef = doc(db, "storeProducts", productId);
                    const updateSubDetails = await updateDoc(docRef, {
                        AvgRating: startingAverage,
                    })
                    setTotalReview(startingAverage);
                    setReviewData(reviewArray);
                    setloading(false);
                })
                setloading(false);
            });
        }
    }
    const [reviewData, setReviewData] = useState<any>([]);
    const [totalReview, setTotalReview] = useState<number>(0);

    const fetchCartData = async () => {
        setloading(true);
        const SupplierQuery = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)
        );
        await onSnapshot(SupplierQuery, (userSnapshot: any) => {
            setUserId(userSnapshot.docs[0]?.id);
            const docId = userSnapshot.docs[0]?.id;
            const newdocRef = collection(db, "storeUsers", docId, "cart");
            onSnapshot(newdocRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item) => {
                    const cartData = item.data();
                    newArray.push({ ...item.data(), id: item.id });
                    setCartData({ ...item.data(), id: item.id });
                    // let existItemIndex = item
                    //     .data()
                    //     .products.findIndex((res: any) => res.id == productId);
                    // if (existItemIndex !== -1) {
                    //     setCurrentProductQue(
                    //         item.data().products[existItemIndex].ChooseQty
                    //     );
                    // }
                    setCartColID(item.id);
                });
                setloading(false);
            });
        });
    };
    useEffect(() => {
        if (UID) {
            fetchCartData();
        } else {
            let CartData = localStorage.getItem("cartData")
            if (reduxData.cart) {
                setCartData(reduxData.cart);
            }
        }
    }, [UID, productId, reduxData.cart]);

    const handleClick: any = async (value: any) => {
        setCartloading(true);
        if (UID) {
            if (!cartColID) {
                const SupplierQuery: any = query(
                    collection(db, "storeUsers"),
                    where("id", "==", UID)
                );
                await onSnapshot(SupplierQuery, async (userSnapshot: any) => {
                    const idRef = userSnapshot.docs[0]?.id;
                    const newRef = doc(collection(db, "storeUsers", idRef, "cart"));
                    const newArray: any = [];
                    const data = {
                        ...value,
                    };

                    const variantData = {
                        ChooseQty: qtyValue,
                        selectedSize: variantSize,
                        selectedColor: variantColor,
                        img: variantImg,
                        selectedVariantPrice
                    }

                    newArray.push(data);
                    await setDoc(newRef, {
                        USDTotal: (qtyValue) * selectedVariantPrice.USDPrice,
                        USDSubTotal: (qtyValue) * selectedVariantPrice.USDPrice,
                        AEDTotal: (qtyValue) * selectedVariantPrice.AEDPrice,
                        AEDSubTotal: (qtyValue) * selectedVariantPrice.AEDPrice,
                        products: [
                            {
                                ...data,
                                variantInfo: {
                                    ...variantData,
                                }
                            },
                        ],
                    }).then(() => {
                        toast.success(t("NewArrival.AddCartToastMsg"));
                        setCartloading(false);
                    });
                });
            } else {
                const newRef = doc(db, "storeUsers", userId, "cart", cartColID);
                let updatedCartData = CartData;
                let productExist = updatedCartData.products.map((res: any) => res.id);
                let checkExitProduct = productExist.indexOf(value.id);
                const index = CartData.products.findIndex(
                    (res: any) => res.id == productId
                );

                if (checkExitProduct == -1) {
                    const data = {
                        ...value,
                    };

                    const variantData = {
                        ChooseQty: qtyValue,
                        selectedSize: variantSize,
                        selectedColor: variantColor,
                        img: variantImg,
                        selectedVariantPrice
                    }

                    CartData.products.push(
                        {
                            ...data,
                            variantInfo: {
                                ...variantData,
                            }
                        },
                    );

                    const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                    CartData.USDTotal += USDTotal;
                    CartData.USDSubTotal += USDTotal;

                    const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                    CartData.AEDTotal += AEDTotal;
                    CartData.AEDSubTotal += AEDTotal

                } else {
                    const currentVariant = updatedCartData.products.map((data: any) => {
                        return {
                            productId: data.id,
                            ...data.variantInfo
                        }
                    });
                    const [isVarinatExists, variantInfoIndex] = checkVariant({
                        color: variantColor, size: variantSize, variant: currentVariant, currentProductId: productId
                    });

                    if (isVarinatExists) {
                        const qty = updatedCartData.products[variantInfoIndex].variantInfo.ChooseQty += qtyValue

                        const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                        CartData.USDTotal += USDTotal;
                        CartData.USDSubTotal += USDTotal;

                        const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                        CartData.AEDTotal += AEDTotal;
                        CartData.AEDSubTotal += AEDTotal;
                    } else {
                        const data = {
                            ...value,
                        };

                        const variantData = {
                            ChooseQty: qtyValue,
                            selectedSize: variantSize,
                            selectedColor: variantColor,
                            img: variantImg,
                            selectedVariantPrice
                        }

                        updatedCartData.products.push(
                            {
                                ...data,
                                variantInfo: {
                                    ...variantData,
                                }
                            },
                        );

                        const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                        CartData.USDTotal += USDTotal;
                        CartData.USDSubTotal += USDTotal;

                        const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                        CartData.AEDTotal += AEDTotal;
                        CartData.AEDSubTotal += AEDTotal
                    }

                }
                setCartData(updatedCartData);
                await updateDoc(newRef, {
                    ...updatedCartData,
                }).then(() => {
                    toast.success(t("NewArrival.AddCartToastMsg"));
                    setCartData(updatedCartData);
                    setQtyValue(1);
                    setCartloading(false);
                });
            }
        } else {
            let CartData = localStorage.getItem("cartData")
            if (!CartData) {
                const newArray: any = [];
                const data = { ...value }
                const variantData = {
                    ChooseQty: qtyValue,
                    selectedSize: variantSize,
                    selectedColor: variantColor,
                    img: variantImg,
                    selectedVariantPrice
                }
                newArray.push(data);
                let cartInfo = {
                    USDTotal: (qtyValue) * selectedVariantPrice.USDPrice,
                    USDSubTotal: (qtyValue) * selectedVariantPrice.USDPrice,
                    AEDTotal: (qtyValue) * selectedVariantPrice.AEDPrice,
                    AEDSubTotal: (qtyValue) * selectedVariantPrice.AEDPrice,
                    products: [
                        {
                            ...data,
                            variantInfo: {
                                ...variantData,
                            }
                        },
                    ],
                }
                dispatch(setCart(cartInfo))
                localStorage.setItem("cartData", JSON.stringify(cartInfo))
                setCartloading(false);
                toast.success(t("NewArrival.AddCartToastMsg"))
            } else {
                let updatedCartData = JSON.parse(CartData)
                let productExist = updatedCartData.products.map((res: any) => res.id);
                let checkExitProduct = productExist.indexOf(value.id);
                const index = updatedCartData.products.findIndex((res: any) => res.id == productId);

                if (checkExitProduct == -1) {
                    const data = {
                        ...value,
                    };

                    const variantData = {
                        ChooseQty: qtyValue,
                        selectedSize: variantSize,
                        selectedColor: variantColor,
                        img: variantImg,
                        selectedVariantPrice
                    }

                    updatedCartData.products.push({
                        ...data,
                        variantInfo: {
                            ...variantData,
                        }
                    },);

                    const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                    updatedCartData.USDTotal += USDTotal;
                    updatedCartData.USDSubTotal += USDTotal;

                    const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                    updatedCartData.AEDTotal += AEDTotal;
                    updatedCartData.AEDSubTotal += AEDTotal

                } else {
                    const currentVariant = updatedCartData.products.map((data: any) => {
                        return {
                            productId: data.id,
                            ...data.variantInfo
                        }
                    });
                    const [isVarinatExists, variantInfoIndex] = checkVariant({
                        color: variantColor, size: variantSize, variant: currentVariant, currentProductId: productId
                    });

                    if (isVarinatExists) {
                        const qty = updatedCartData.products[variantInfoIndex].variantInfo.ChooseQty += qtyValue

                        const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                        updatedCartData.USDTotal += USDTotal;
                        updatedCartData.USDSubTotal += USDTotal;

                        const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                        updatedCartData.AEDTotal += AEDTotal;
                        updatedCartData.AEDSubTotal += AEDTotal;
                    } else {
                        const data = {
                            ...value,
                        };

                        const variantData = {
                            ChooseQty: qtyValue,
                            selectedSize: variantSize,
                            selectedColor: variantColor,
                            img: variantImg,
                            selectedVariantPrice
                        }

                        updatedCartData.products.push(
                            {
                                ...data,
                                variantInfo: {
                                    ...variantData,
                                }
                            },
                        );

                        const USDTotal = (qtyValue) * selectedVariantPrice.USDPrice
                        updatedCartData.USDTotal += USDTotal;
                        updatedCartData.USDSubTotal += USDTotal;

                        const AEDTotal = (qtyValue) * selectedVariantPrice.AEDPrice
                        updatedCartData.AEDTotal += AEDTotal;
                        updatedCartData.AEDSubTotal += AEDTotal
                    }
                }

                setCartData(updatedCartData);
                dispatch(setCart(updatedCartData))
                localStorage.setItem("cartData", JSON.stringify(updatedCartData))
                setCartData(updatedCartData);
                setCartloading(false);
                toast.success(t("NewArrival.AddCartToastMsg"))
            }
        }
    };

    const handleValue = (value: any) => {
        setQtyValue(value);
    }

    const fetchWishListData = async () => {
        const SupplierQuery = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)
        );
        await onSnapshot(SupplierQuery, (userSnapshot: any) => {
            const docId = userSnapshot.docs[0]?.id
            if (docId) {
                const newdocRef = collection(db, "storeUsers", docId, "wishlist");
                onSnapshot(newdocRef, (querydata) => {
                    let newArray: any = [];
                    querydata.docs.map((item) => {
                        newArray.push(item.id)
                    })
                    setWishData(newArray)
                });
            }
        })
    }

    useEffect(() => {
        if (UID) {
            fetchWishListData();
        }
    }, [UID])

    const addWishList = async (value: any) => {
        let { id } = value

        if (UID) {
            const SupplierQuery = query(
                collection(db, "storeUsers"),
                where("id", "==", UID)
            );
            onSnapshot(SupplierQuery, async (userSnapshot) => {
                const idRef = userSnapshot.docs[0].id
                const newRef = doc(db, "storeUsers", idRef, "wishlist", id);
                const newArray = [];
                const data = { ...value }
                newArray.push(data);
                let isWishList = wishData && wishData.includes(id)
                if (isWishList) {
                    const deleteService = doc(
                        db,
                        "storeUsers",
                        userId,
                        "wishlist",
                        id
                    );
                    deleteDoc(deleteService).then(() => {
                        toast.success(t("Wishlist.RemoveToastMsg"));
                    });
                } else {
                    setDoc(newRef, {
                        ...data
                    }).then(() => {
                        toast.success(t("NewArrival.AddWishListToastMsg"))
                    })
                }
            })
        } else {
            toast.error(t("NewArrival.LoginMsg"));
            router.push("/login")
        }
    }

    const currencyPriceFieldName = !currencyData ? "USDPrice" : currencyData == "USD" ? "USDPrice" : "AEDPrice"

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
            marginTop={10}
            marginBottom={10}
            outline={"3px solid rgba(0, 0, 0, 0.05)"}
        >
            {loading && <>
                <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                    <Spinner />
                </Flex>
            </>}
            {!loading && (
                <>
                    <Stack
                        display={"flex"}
                        gap={{ base: "2rem", md: '5rem' }}
                        flexDirection={{ base: "column-reverse", lg: "row" }}
                        justifyContent={"space-between"}
                    >
                        <Stack
                            direction={{ base: "column-reverse", lg: "row" }}
                            spacing={{ base: "6", lg: "12", xl: "16" }}
                        >
                            <Stack
                                spacing={{ base: "6", lg: "8" }}
                                justify="center"
                            >
                                <Stack spacing={{ base: "3", md: "4" }}>
                                    <Stack spacing="3">
                                        <Heading size="md" fontWeight="normal">
                                            {productData.ProductName && productData.ProductName[locale]}
                                        </Heading>
                                    </Stack>
                                    <HStack alignSelf="baseline">
                                        <Button
                                            fontSize="md"
                                            lineHeight="1"
                                            fontWeight={"medium"}
                                            bg={"primaryColor"}
                                            _hover={{ bgColor: "secondaryColor" }}
                                            color={"#fff"}
                                            gap={2}
                                            width={"4rem"}
                                            height={"1.7rem"}
                                        >
                                            {/* {totalReview.toFixed(1)} */}
                                            {productData?.AvgRating?.toFixed(1)}
                                            <StarIcon w={3} h={3} />
                                        </Button>
                                        <Text
                                            lineHeight="1"
                                            onClick={onOpen}
                                            cursor={"pointer"}
                                        >
                                            {t("ProductDetails.Basedon")} {reviewData.length} {t("ProductDetails.Reviews")}
                                        </Text>
                                        {
                                            reviewData.length === 0 ? null : (
                                                <Modal onClose={onClose} isOpen={isOpen} isCentered size={"2xl"}>
                                                    <ModalOverlay />
                                                    <ModalContent>
                                                        <ModalHeader>{t("Reviews.ProductReviews")}</ModalHeader>
                                                        <ModalCloseButton />
                                                        <ModalBody padding={0}>
                                                            <Reviews idProduct={productId} />
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button onClick={onClose}>{t("Reviews.CloseButton")}</Button>
                                                        </ModalFooter>
                                                    </ModalContent>
                                                </Modal>
                                            )
                                        }
                                    </HStack>
                                    <PriceTag
                                        // price={productData.ProductPrice &&
                                        //     productData.ProductPrice[!currencyData ? "USD" : currencyData == "USD" ? "USD" : "AED"]}
                                        price={selectedVariantPrice ? selectedVariantPrice[currencyPriceFieldName]
                                            : productData.ProductPrice && productData?.ProductPrice[!currencyData ? "USD" : currencyData == "USD" ? "USD" : "AED"]}
                                        currency={reduxData.currency == "USD" ? "USD" : reduxData.currency}
                                        rootProps={{ fontSize: "xl" }}
                                    />
                                    <Text>
                                        {productData.Description && productData.Description[locale]}
                                    </Text>
                                </Stack>
                                <Stack
                                    direction={{ base: "column", md: "row" }}
                                >
                                    <Stack
                                        flex="1"
                                        display={!variantName ? "block" : variantName == "color" ? "block" : "none"}
                                    >
                                        <Text>Color:</Text>
                                        <HStack flexWrap={'wrap'} gap={2} cursor={"pointer"}>
                                            {productData?.variants?.map((option: any) => (<>
                                                {
                                                    option.varientName == "color" &&
                                                    option.subVarientList.map((data: any, index: number) => {
                                                        return (
                                                            <Circle
                                                                key={index}
                                                                size="10"
                                                                style={{ margin: 0 }}
                                                                borderWidth="1px"
                                                                borderColor={variantColor == data?.name ? "#000" : "inherit"}
                                                                bg={data?.name}
                                                                onClick={() =>
                                                                    setVariantColor(data.name)
                                                                }
                                                            >
                                                            </Circle >
                                                        )
                                                    })
                                                }
                                            </>))}
                                        </HStack>
                                    </Stack>
                                    <Stack flex="1" display={!variantName ? "block" : variantName == "size" ? "block" : "none"}>
                                        <Text>Size:</Text>
                                        <HStack flexWrap={'wrap'} gap={2}>
                                            {productData?.variants?.map((option: any) => (<>
                                                {
                                                    option.varientName == "size" &&
                                                    option.subVarientList.map((data: any, index: number) => {
                                                        return (
                                                            <Button
                                                                key={index}
                                                                px="0"
                                                                style={{ margin: 0 }}
                                                                cursor="pointer"
                                                                variant="outline"
                                                                borderColor={variantSize == data.name ? "#000" : "inherit"}
                                                                onClick={() => setVariantSize(data.name)}
                                                            >
                                                                {data.name}
                                                            </Button>
                                                        )
                                                    })
                                                }
                                            </>))}
                                        </HStack>
                                    </Stack>
                                </Stack>
                                <HStack
                                    spacing={{ base: "4", md: "8" }}
                                    align="flex-end"
                                    justify="space-evenly"
                                >
                                    <Box flex="1">
                                        <QuantityPicker
                                            defaultValue={1}
                                            max={10}
                                            handleValue={handleValue}
                                        />
                                    </Box>
                                    <Box flex="1">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            fontSize="xl"
                                            width="full"
                                            onClick={() => addWishList(productData)}
                                        >
                                            <Icon
                                                as={wishData.includes(productId) ? FaHeart : FiHeart}
                                                boxSize="6"
                                                color={wishData.includes(productId) ? "red" : ""}
                                            />
                                        </Button>
                                    </Box>
                                </HStack>
                                <Button
                                    color="#fff"
                                    size="lg"
                                    fontWeight={"medium"}
                                    className="btn"
                                    onClick={() => handleClick(productData)}
                                >
                                    {cartloading ? <Spinner /> : t("ProductDetails.AddToCart")}
                                </Button>
                            </Stack>
                        </Stack>
                        <AliceCarousel
                            items={renderSlides()}
                            autoPlayInterval={3000}
                            autoPlay={true}
                            disableButtonsControls={false}
                            activeIndex={activeIndex}
                        />
                    </Stack>
                </>
            )
            }
        </Box >
    );
};



function checkVariant({ color = null, size = null, variant, currentProductId }: any) {

    const variantValues = [{ value: color, fieldName: "selectedColor" },
    { value: size, fieldName: "selectedSize" }];
    let matchVariantIndex;
    if (variant) {
        const isMatch = variant.some((value: any, variantIndex: any) => {
            if (value.productId != currentProductId) {
                return false
            }
            const isAllVariantValMatch = variantValues.every((varVal, varIndex) => {
                const isTrue = value[varVal.fieldName] === varVal.value;
                return isTrue
            });
            if (isAllVariantValMatch) {
                matchVariantIndex = variantIndex;
            }
            return isAllVariantValMatch;
        })
        return [isMatch, matchVariantIndex];
    }
    return [false, null];
}