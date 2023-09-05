import { db } from "@/firebase/client";
import useTranslation from "@/hooks/useTranslation";
import {
    Box,
    Heading,
    Stack,
} from "@chakra-ui/react";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    where,
    query,
    limit,
    updateDoc,
} from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Confirmorder = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const clearCartData = async () => {
        const userId = localStorage.getItem("userId");
        const quertToFindStoreUserId: any = query(
            collection(db, "storeUsers"),
            where("id", "==", userId),
            limit(1)
        );
        const storeUserDoc = await getDocs(quertToFindStoreUserId);
        const storeUserId = storeUserDoc.docs[0].ref;
        const cartCollectionRef = collection(storeUserId, "cart");
        const cartDocumentsSnapshot = await getDocs(cartCollectionRef);
        if (cartDocumentsSnapshot.empty) {
            return;
        }
        cartDocumentsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
        return;
    };

    useEffect(() => {
        const fetchData = async () => {
            let orderID: any = router.query.id
            if (router.query.id) {
                const newRef = doc(db, "Orders", orderID)
                await updateDoc(newRef, {
                    paymentStatus: "Success",
                    paymentWith: "Payment with Paypal",
                })
                await clearCartData();
                setTimeout(() => router.push("/order"), 3000);
            }
            if (router.query.paymentStatus) {
                let Id: any = localStorage.getItem("orderID")
                const newRef = doc(db, "Orders", Id)
                await updateDoc(newRef, {
                    paymentStatus: "Cash On Delivery",
                    paymentWith: "Cash On Delivery",
                })
                await clearCartData();
                setTimeout(() => router.push("/order"), 3000);
            }
        };
        fetchData();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            const id: any = router.query.orderID;
            if (
                router &&
                router.query &&
                router.query.orderID &&
                router.query.paymentStatus &&
                router.query.session_id
            ) {
                if (router.query.paymentStatus === "Success") {
                    const docRef = doc(db, "Orders", id);
                    const updateSubDetails = await updateDoc(docRef, {
                        paymentStatus: "Success",
                        paymentWith: "Payment with Stripe",
                    }).then(async () => {
                        await clearCartData();
                        router.replace("/confirmorder");
                        setTimeout(() => router.push("/order"), 3000);
                    });
                }
            } else {
                setTimeout(() => router.push("/order"), 3000);
            }
        };
        fetchData();
    }, [router]);

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
            marginTop={"7rem"}
            marginBottom={"8rem"}
        >
            {/*<Stack
                // direction={{ base: "column-reverse", lg: "row" }}
                spacing={{ base: "6", lg: "12", xl: "16" }}
            >
                <Stack
                    spacing={{ base: "6", lg: "8" }}
                    // maxW={{ lg: "sm" }}
                    justify="center"
                >
            <Stack spacing={{ base: "3", md: "4" }}>*/}
            <Stack spacing="3" paddingBottom={"1rem"}>
                <Heading size="md" fontWeight="normal">
                    {t("ConfirmOrder.Title")}
                </Heading>
            </Stack>
            {/*<Stack>
                <Text fontSize={"xl"}>Hello Prince,</Text>
                <Text fontSize={"xl"}>
                    Your Order has been confirmed and will be
                    shipping within next 2-4 days.
                </Text>
            </Stack>
            <Stack
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                borderTop={"2px"}
                borderBottom={"2px"}
                borderColor={"#CBD5E0"}
                paddingTop={"1rem"}
                paddingBottom={"1rem"}
            >
                <Stack>
                    <Text>Order Date</Text>
                    <Text>07 March, 2023</Text>
                </Stack>
                <Stack>
                    <Text>Order No.</Text>
                    <Text>BK56289654</Text>
                </Stack>
                <Stack>
                    <Text>Payment</Text>
                    <Text>Visa -4955</Text>
                </Stack>
                <Stack>
                    <Text>Address</Text>
                    <Text>4955 -Preston Road</Text>
                </Stack>
            </Stack>
            <Stack
                direction="row"
                spacing="5"
                width="full"
                justifyContent={"space-between"}
                borderBottom={"2px"}
                borderColor={"#CBD5E0"}
                paddingBottom={"1rem"}
                padding="8"
            >
                <Stack direction="row">
                    <Image
                        // rounded="lg"
                        width="120"
                        height="120"
                        // fit="cover"
                        src="https://images.pexels.com/photos/7319324/pexels-photo-7319324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="bag"
                        draggable="false"
                        loading="lazy"
                    />
                    <Box pt="4">
                        <Stack spacing="0.5" paddingLeft={"0.5rem"}>
                            <Text
                                fontWeight="medium"
                                fontSize={"1.5rem"}
                            >
                                Ferragamo bag
                            </Text>
                            <Text fontSize="sm">Tan, 40mm</Text>
                        </Stack>
                    </Box>
                </Stack>
                <Stack justifyContent={"center"}>
                    <Text fontSize={"1.2rem"}>Qty 5</Text>
                </Stack>
                <Stack justifyContent={"center"}>
                    <Text fontSize={"1.2rem"}>$300</Text>
                </Stack>
            </Stack>
            <Stack
                spacing="8"
                rounded="lg"
                padding="8"
                width="full"
                borderBottom={"2px"}
                borderColor={"#CBD5E0"}
            >
                <Stack spacing="6">
                    <Flex justify="space-between">
                        <Text fontSize="lg">Subtotal</Text>
                        <Text fontSize="xl">$300</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="lg">Shipping</Text>
                        <Text fontSize="xl">$100</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="lg">Texes</Text>
                        <Text fontSize="xl">$50</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="lg">Discount(SAVE20)</Text>
                        <Text fontSize="xl">-20%($50)</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold">
                            Total
                        </Text>
                        <Text fontSize="xl" fontWeight="extrabold">
                            $500
                        </Text>
                    </Flex>
                </Stack>
            </Stack>
            <Stack alignItems={"center"}>
                <Text>
                    we will send you shipping confirmation when your
                    item(s) are on the way! We appreciate your
                    business, and hope you enjoy your purchase.
                    Thank You!
                </Text>
            </Stack>
        </Stack>
                </Stack >
            </Stack >*/}
        </Box >
    );
};

export default Confirmorder;
