import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Link,
    SimpleGrid,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, setDoc, query, where, onSnapshot, doc, updateDoc, orderBy, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { setCart, setSortValue } from "@/store";
import { useDispatch } from "react-redux";

export const Trending = () => {
    const [allproducts, setAllproducts] = useState<any[]>([]);
    const [UID, setUID] = useState("");
    const [userId, setUserId] = useState<string>();
    const [userDocId, setUserDocId] = useState();
    const [CartData, setCartData] = useState<any>({});
    const [wishData, setWishData] = useState<any>([]);
    const [loading, setloading] = useState(false)
    const [cartColID, setCartColID] = useState('')
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleClick = async (value: any) => {
        setloading(!loading)
        if (UID) {
            if (!userDocId) {
                const SupplierQuery: any = query(
                    collection(db, "storeUsers"),
                    where("id", "==", UID)
                );
                await onSnapshot(SupplierQuery, async (userSnapshot: any) => {
                    const idRef = userSnapshot.docs[0].id
                    const newRef = doc(
                        collection(db, "storeUsers", idRef, "cart")
                    );
                    const newArray: any = [];
                    const data = { ...value, ChooseQty: 1 }
                    newArray.push(data);
                    await setDoc(newRef, {
                        USDTotal: value.ProductPrice.USD,
                        USDSubTotal: value.ProductPrice.USD,
                        AEDTotal: value.ProductPrice.AED,
                        AEDSubTotal: value.ProductPrice.AED,
                        products: [{
                            ...data
                        }]
                    }).then(() => {
                        toast.success(t("NewArrival.AddCartToastMsg"))
                    })
                })
            } else {
                const newRef = doc(db, "storeUsers", userId, "cart", cartColID)
                let updatedCartData = CartData
                let productExist = updatedCartData.products.map((res: any) => res.id)
                let checkExitProduct = productExist.indexOf(value.id)
                if (checkExitProduct == -1) {
                    CartData.products.push({
                        ...value, ChooseQty: 1
                    })
                } else {
                    updatedCartData.products[checkExitProduct].ChooseQty += 1
                }
                CartData.USDTotal += value.ProductPrice.USD
                CartData.USDSubTotal += value.ProductPrice.USD
                CartData.AEDTotal += value.ProductPrice.AED,
                    CartData.AEDSubTotal += value.ProductPrice.AED,
                    setCartData(updatedCartData)
                setloading(!loading)
                await updateDoc(newRef, {
                    ...updatedCartData
                }).then(() => {
                    toast.success(t("NewArrival.AddCartToastMsg"));
                    setCartData(updatedCartData)
                    setloading(!loading)
                })
            }
        } else {
            // toast.error(t("NewArrival.LoginMsg"));
            // router.push("/login")

            let CartData = localStorage.getItem("cartData")
            if (!CartData) {
                const newArray: any = [];
                const data = { ...value, ChooseQty: 1 }
                newArray.push(data);
                let cartInfo = {
                    USDTotal: value.ProductPrice.USD,
                    USDSubTotal: value.ProductPrice.USD,
                    AEDTotal: value.ProductPrice.AED,
                    AEDSubTotal: value.ProductPrice.AED,
                    products: [{
                        ...data
                    }]
                }

                dispatch(setCart(cartInfo))
                localStorage.setItem("cartData", JSON.stringify(cartInfo))
                toast.success(t("NewArrival.AddCartToastMsg"))
            } else {
                let updatedCartData = JSON.parse(CartData)
                let productExist = updatedCartData.products.map((res: any) => res.id)
                let checkExitProduct = productExist.indexOf(value.id)
                if (checkExitProduct == -1) {
                    updatedCartData.products.push({
                        ...value, ChooseQty: 1
                    })
                } else {
                    updatedCartData.products[checkExitProduct].ChooseQty += 1
                }
                updatedCartData.USDTotal += value.ProductPrice.USD;
                updatedCartData.USDSubTotal += value.ProductPrice.USD;
                updatedCartData.AEDTotal += value.ProductPrice.AED;
                updatedCartData.AEDSubTotal += value.ProductPrice.AED;

                dispatch(setCart(updatedCartData))
                localStorage.setItem("cartData", JSON.stringify(updatedCartData))
                toast.success(t("NewArrival.AddCartToastMsg"))
            }

        }
    };

    useEffect(() => {
        setUID(localStorage.getItem("userId"))
        const fetchAllProducts = async () => {
            const productsQuery = collection(db, "storeProducts");
            const productsQueryRef = query(
                productsQuery,
                orderBy("createdAt", "desc")
            );
            await onSnapshot(productsQueryRef, (productsSnapshot) => {
                const productsArr: any = [];
                productsSnapshot.docs.map(async (products) => {
                    const productsdata = products.data();
                    if (products.data().isTrending) {
                        productsArr.push({ ...productsdata, id: products.id });
                    }
                });
                setAllproducts(productsArr);
            });
        };
        fetchAllProducts();
    }, []);


    const fetchCartData = async () => {
        const SupplierQuery = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)

        );
        await onSnapshot(SupplierQuery, (userSnapshot: any) => {

            setUserId(userSnapshot.docs[0]?.id)
            const docId = userSnapshot.docs[0]?.id
            if (docId) {
                const newdocRef = collection(db, "storeUsers", docId, "cart");
                onSnapshot(newdocRef, (querydata) => {
                    let newArray: any = [];
                    querydata.docs.map((item) => {
                        newArray.push({ ...item.data(), id: item.id })
                        setCartData({ ...item.data(), id: item.id })
                        setCartColID(item.id)
                    })
                    setUserDocId(newArray[0]?.id);
                });
            }
        })
    }

    useEffect(() => {
        if (UID) {
            fetchCartData();
        }
    }, [UID])

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
            // }
        } else {
            toast.error(t("NewArrival.LoginMsg"));
            router.push("/login")
        }
    }

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8" }}
            display={allproducts.length == 0 ? "none" : "block"}
        >
            <Stack
                spacing={{ base: "6", md: "8", lg: "12" }}
                pb={{ base: "6", md: "8", lg: "12" }}
            >
                <Flex
                    justify="space-between"
                    align={{ base: "center", md: "center" }}
                    direction={{ base: "row", md: "row" }}
                >
                    <Heading fontSize={"2rem"} mb={{ base: "3", md: "0" }}>
                        {t("Home.Trending")}
                    </Heading>
                    <HStack spacing={{ base: "2", md: "3" }}>
                        <Button
                            fontWeight="semibold"
                            color={'#000'}
                            variant="ghost"
                            onClick={() => {
                                router.push(`/allproducts`);
                                dispatch(setSortValue(t("AllProducts.Trending")));
                            }}
                            fontSize={{ base: "lg", md: "lg" }}
                        >
                            {t('Home.AllProductSeeAll')}
                        </Button>
                    </HStack>
                </Flex>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
                    gap={{ base: "8", lg: "10" }}
                >
                    {allproducts.map((product, index) => {
                        let isWishList = wishData && wishData.includes(product.id)
                        if (index < 3) {
                            return <ProductCard
                                key={index}
                                product={product}
                                wishData={wishData}
                                isWishList={isWishList}
                                onHandleClick={handleClick}
                                wishList={addWishList}
                            />
                        }
                    })}
                </SimpleGrid>
            </Stack>
        </Box >
    );
}