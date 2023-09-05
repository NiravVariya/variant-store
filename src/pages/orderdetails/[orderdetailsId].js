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
    useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";
import { ReviewForm } from '@/components/ReviewForm/App';
import { toast } from 'react-hot-toast';
import useTranslation from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import Image from 'next/image';

const OrderdetailsId = () => {
    const [orderDocData, setOrderDocData] = useState({});
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [productId, setProductId] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const reduxData = useSelector((state) => state.icon);
    const currencyData = reduxData.currency ? reduxData.currency : "USD"
    const { t } = useTranslation();
    const { locale } = useRouter();

    const router = useRouter();
    const { orderdetailsId } = router.query;
    useEffect(() => {
        const fetchData = async () => {
            const orderRef = collection(db, "Orders");
            onSnapshot(orderRef, (orderSnap) => {
                orderSnap.docs.map((res) => {
                    if (res.id == orderdetailsId) {
                        setOrderDocData(res.data());
                        setOrderStatus(res.data().orderStatus);
                        setLoading(false);
                    } else {
                        console.log("Doc Not Found");
                    }
                })
            })
        };
        fetchData();
    }, [orderdetailsId]);

    const handleReviewClick = (id) => {
        if (orderStatus === 'Delivered' || orderStatus == "Completed") {
            onOpen();
            setProductId(id);
        } else {
            toast.error(t("OrderDetails.StatusToastMsg"))
        }
    }

    return (
        <div>
            <App />
            <TabsWithLine />
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
                                {t("Order.OrderID")}: {orderdetailsId}
                            </Heading>
                            <Flex gap={3}>
                                <Text>{t("Order.Date")}: </Text>
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
                                    {t("Order.UserInfo")}:
                                </Heading>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>{t("Order.name")}: </Text>
                                    <Text>{orderDocData.name}</Text>
                                </Flex>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>{t("Order.Email")}: </Text>
                                    <Text>{orderDocData.email}</Text>
                                </Flex>
                                <Flex gap={3}>
                                    <Text fontWeight={"semibold"}>{t("Order.MobileNo")}: </Text>
                                    <Text>{orderDocData.mobileNo}</Text>
                                </Flex>
                            </Stack>
                            <Stack alignItems={{ base: "flex-start", md: "flex-end" }} mt={4} borderTop={{ base: "1px", md: "0px" }} borderColor={"#999"}>
                                <Heading size={{ base: "xs", md: "sm" }} mb={{ base: 0, md: 5 }} mt={{ base: 5, md: 0 }}>
                                    {t("Order.DeliveryAddress")}:
                                </Heading>
                                <Flex flexDirection={"column"} alignItems={{ base: "flex-start", md: "flex-end" }}>
                                    <Text mb={{ base: 5, md: 0 }}>{orderDocData.address}</Text>
                                </Flex>
                                <Flex alignItems={{ base: "flex-start", md: "flex-end" }} gap={2}>
                                    <Text mb={{ base: 5, md: 0 }} fontWeight={"semibold"}>{t("Order.City")}:</Text>
                                    <Text mb={{ base: 5, md: 0 }}>{orderDocData.city}</Text>
                                </Flex>
                            </Stack>
                        </Flex>
                        {
                            orderDocData && orderDocData.products && orderDocData.products.map((data, index) => {
                                console.log("data===================>", data);
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
                                            width={150}
                                            height={150}
                                            alt='image'
                                            borderRadius={10}
                                        />
                                        <CardBody paddingTop={0}>
                                            <Text fontSize={{ base: "lg", md: 'xl' }} fontWeight={"semibold"}>{data.ProductName[locale]}</Text>
                                            <Flex direction={'column'}>
                                                <Text
                                                    fontSize={"sm"}
                                                    display={data.variantInfo.selectedSize == "" ? "none" : "block"}
                                                >
                                                    {t("Order.Size")} : {data.variantInfo.selectedSize}
                                                </Text>
                                                <Text
                                                    fontSize={"sm"}
                                                    display={data.variantInfo.selectedColor == "" ? "none" : "block"}
                                                >
                                                    {t("Order.Color")} : {data.variantInfo.selectedColor}
                                                </Text>
                                            </Flex>
                                            {
                                                orderStatus === 'Delivered' || orderStatus == "Completed" ? (
                                                    <Flex justifyContent={"flex-start"}>
                                                        <Button
                                                            mt={2}
                                                            className='btn'
                                                            size={{ base: "xs", md: 'sm' }}
                                                            colorScheme="blue"
                                                            onClick={() => handleReviewClick(data.id)}
                                                        >
                                                            <Text fontSize={"small"}>
                                                                {t("OrderDetails.WriteAReview")}
                                                            </Text>
                                                        </Button>
                                                        <ReviewForm open={isOpen} close={onClose} idProduct={productId} />
                                                    </Flex>
                                                ) : null
                                            }
                                        </CardBody>
                                        <Stack>
                                            <Text>
                                                {currencyData === "USD" ?
                                                    `$${(data.variantInfo.selectedVariantPrice.USDPrice)}` :
                                                    `${currencyData} ${(data.variantInfo.selectedVariantPrice.AEDPrice)}`}
                                            </Text>
                                            <Text>
                                                {t("Order.Qty")} : {data.variantInfo.ChooseQty}
                                            </Text>
                                        </Stack>
                                    </Card>
                                )
                            })
                        }
                        <Stack float={"right"} borderTop={"1px"}>
                            <Text fontSize={"xl"} fontWeight={"semibold"} mt={3}>{t("Order.Total")} : {currencyData === "USD" ? `$${(orderDocData.USDTotal)}` : `${currencyData} ${(orderDocData.AEDTotal)}`}</Text>
                        </Stack>
                    </Box>
                )}
            </>
            <Footer />
        </div >
    );
};

export default OrderdetailsId;