import {
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    Heading,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";
import Image from 'next/image';

const OrderdetailsId = () => {
    const [orderDocData, setOrderDocData] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { orderdetailsId } = router.query;
    useEffect(() => {
        const fetchData = async () => {
            const orderRef = collection(db, "Orders");
            onSnapshot(orderRef, (orderSnap) => {
                orderSnap.docs.map((res) => {
                    if (res.id == orderdetailsId) {
                        setOrderDocData(res.data());
                        setLoading(false);
                    } else {
                        console.log("Doc Not Found");
                    }
                })
            })
        };
        fetchData();
    }, [orderdetailsId]);

    return (
        <div>
            <>
                {loading ? (
                    <>
                        <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                            <Spinner />
                        </Flex>
                    </>
                ) : (
                    <Box
                        maxW="7xl"
                        mx="auto"
                        px={{ base: "4", md: "8", lg: "12" }}
                        py={{ base: "6", md: "8", lg: "5" }}
                        mb={14}
                    >
                        <Stack mb={5}>
                            <Heading size={{ base: "xs", md: "sm" }}>
                                Order ID: {orderdetailsId}
                            </Heading>
                            <Flex gap={3}>
                                <Text> Order Date: </Text>
                                <Text fontWeight={"semibold"}>
                                    {orderDocData.OrderDate && new Date(
                                        orderDocData.OrderDate.seconds * 1000
                                    ).toDateString()}
                                </Text>
                            </Flex>
                        </Stack>
                        <Flex mb={5} borderTop={"1px"} borderBottom={"1px"} borderColor={"#999"} justifyContent={"space-between"} flexDirection={{ base: "column", md: "row" }}>
                            <Stack mt={4} mb={5}>
                                <Heading size={{ base: "xs", md: "sm" }} mb={{ base: 0, md: 5 }}>
                                    User Info:
                                </Heading>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>Name: </Text>
                                    <Text>{orderDocData.name}</Text>
                                </Flex>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>Email: </Text>
                                    <Text>{orderDocData.email}</Text>
                                </Flex>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>Mobile Number: </Text>
                                    <Text>{orderDocData.mobileNo}</Text>
                                </Flex>
                            </Stack>
                            <Stack alignItems={{ base: "flex-start", md: "flex-end" }} mt={4} borderTop={{ base: "1px", md: "0px" }} borderColor={"#999"}>
                                <Heading size={{ base: "xs", md: "sm" }} mb={{ base: 0, md: 5 }} mt={{ base: 5, md: 0 }}>
                                    Delivery Address:
                                </Heading>
                                <Flex flexDirection={"column"} alignItems={{ base: "flex-start", md: "flex-end" }}>
                                    <Text mb={{ base: 5, md: 0 }}>{orderDocData.address}</Text>
                                </Flex>
                                <Flex alignItems={{ base: "flex-start", md: "flex-end" }} gap={2}>
                                    <Text mb={{ base: 5, md: 0 }} fontWeight={"semibold"}>City:</Text>
                                    <Text mb={{ base: 5, md: 0 }}>{orderDocData.city}</Text>
                                </Flex>
                            </Stack>
                        </Flex>
                        {
                            orderDocData && orderDocData.products && orderDocData.products.map((data, index) => {
                                return (
                                    <Card
                                        direction={{ base: 'row', sm: 'row', md: "row" }}
                                        overflow='hidden'
                                        alignItems={{ base: "center" }}
                                        width={"100%"}
                                        bgColor={"transparent"}
                                        shadow={"none"}
                                        key={index}
                                        mb={4}
                                    >
                                        <Image
                                            src={data.variantInfo.img === "" ? data.mainImage : data.variantInfo.img}
                                            style={{ objectFit: "cover" }}
                                            width={120}
                                            height={120}
                                            alt='image'
                                            borderRadius={10}
                                        />
                                        <CardBody paddingTop={0}>
                                            <Text fontSize={{ base: "lg", md: '2xl' }} fontWeight={"semibold"}>{data.ProductName.en}</Text>
                                            <Flex direction={'column'}>
                                                <Text
                                                    fontSize={"sm"}
                                                    display={data.variantInfo.selectedSize == "" ? "none" : "block"}
                                                >
                                                    size : {data.variantInfo.selectedSize}
                                                </Text>
                                                <Text
                                                    fontSize={"sm"}
                                                    display={data.variantInfo.selectedColor == "" ? "none" : "block"}
                                                >
                                                    color : {data.variantInfo.selectedColor}
                                                </Text>
                                            </Flex>
                                        </CardBody>
                                        <Stack>
                                            <Text>
                                                ${(data.variantInfo.selectedVariantPrice.USDPrice)}
                                            </Text>
                                            <Text>
                                                Qty : {data.variantInfo.ChooseQty}
                                            </Text>
                                        </Stack>
                                    </Card>
                                )
                            })
                        }
                        <Stack float={"right"} borderTop={"1px"}>
                            <Text fontSize={"xl"} fontWeight={"semibold"} mt={3}>Total : ${(orderDocData.USDTotal)}</Text>
                        </Stack>
                    </Box>
                )}
            </>
        </div >
    );
};

export default OrderdetailsId;