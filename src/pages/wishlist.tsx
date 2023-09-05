import React, { useEffect, useState } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import { Box, Button, Flex, Link, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { ProductCard } from "@/components/NewArrival/ProductCard";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import blankImg from "@/assets/empty.svg";
import useTranslation from "@/hooks/useTranslation";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";

const Wishlist = () => {
    const [UID, setUID] = useState("");
    const [wishListData, setWishListData] = useState([]);
    const [userId, setUserId] = useState<string>();
    const [CartData, setCartData] = useState<any>({});
    const [loading, setloading] = useState(false);
    const [cartColID, setCartColID] = useState('');
    const router = useRouter();
    const { t } = useTranslation();

    const fetchwishListData = async () => {
        setloading(true);
        const SupplierQuery = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)
        );
        await onSnapshot(SupplierQuery, (userSnapshot: any) => {
            const docId = userSnapshot.docs[0].id
            const newdocRef = collection(db, "storeUsers", docId, "wishlist");
            onSnapshot(newdocRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item) => {
                    newArray.push({ ...item.data(), id: item.id })
                })
                setWishListData(newArray)
                setloading(false);
            });
        })
    }

    useEffect(() => {
        setUID(localStorage.getItem("userId"))
        if (UID) {
            fetchwishListData();
        }
    }, [UID])

    const fetchCartData = async () => {
        const SupplierQuery = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)

        );
        await onSnapshot(SupplierQuery, (userSnapshot: any) => {
            setUserId(userSnapshot.docs[0].id)
            const docId = userSnapshot.docs[0].id
            const newdocRef = collection(db, "storeUsers", docId, "cart");
            onSnapshot(newdocRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item) => {
                    newArray.push({ ...item.data(), id: item.id })
                    setCartData({ ...item.data(), id: item.id })
                    setCartColID(item.id)
                })
            });
        })
    }

    useEffect(() => {
        if (UID) {
            fetchCartData();
        }
    }, [UID])

    const addWishList = async (value: any) => {
        const deleteService = doc(
            db,
            "storeUsers",
            userId,
            "wishlist",
            value.id
        );
        deleteDoc(deleteService).then(() => {
            toast.success(t("Wishlist.RemoveToastMsg"));
        });
    }

    return (<>
        <div>
            <App />
            <TabsWithLine />
            {loading && <>
                <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                    <Spinner />
                </Flex>
            </>}
            {!loading && (<>
                <Box
                    maxW="7xl"
                    mx="auto"
                    px={{ base: "4", md: "8", lg: "12" }}
                    py={{ base: "6", md: "8", lg: "12" }}
                >
                    <Stack
                        spacing={{ base: "6", md: "8", lg: "12" }}
                        pb={{ base: "6", md: "8", lg: "12" }}
                    >
                        {
                            wishListData.length != 0 ? (
                                <SimpleGrid
                                    columns={{ base: 1, sm: 2, md: 4, lg: 4 }}
                                    gap={{ base: "8", lg: "10" }}
                                >
                                    {wishListData.map((data, index) => {
                                        return <ProductCard
                                            key={index}
                                            product={data}
                                            isWishList={true}
                                            wishList={addWishList}
                                        />;
                                    })}
                                </SimpleGrid>
                            ) : (
                                <>
                                    <Flex justifyContent={"center"}>
                                        <Image src={blankImg} alt="blank img" width={300} height={300} />
                                    </Flex>
                                    <Flex alignItems={"center"} flexDirection={"column"}>
                                        <Text fontSize={"lg"}>{t("ShoppingCart.ProductNotFound")}</Text>
                                        <Button
                                            variant={"ghost"}
                                            color={"primaryColor"}
                                            onClick={() => router.push("/allproducts")}
                                        >
                                            {t("ShoppingCart.AllProducts")}
                                        </Button>
                                    </Flex>
                                </>
                            )
                        }
                    </Stack>
                </Box>
                <Footer />
            </>)}
        </div>
    </>);
};

export default WithAuth(Wishlist, USER_TYPE.shouldAuthenticated);