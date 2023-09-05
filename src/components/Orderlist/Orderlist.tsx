import { db } from "@/firebase/client";
import useTranslation from "@/hooks/useTranslation";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Stack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@chakra-ui/react";
import { collection, doc, onSnapshot, query, updateDoc, where, orderBy } from "firebase/firestore";
import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import ReactPaginate from 'react-paginate';
import blankImg from "@/assets/empty.svg";
import Image from "next/image";

const Orderlist = () => {
    const [UID, setUID] = useState("");
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemOffset, setItemOffset] = useState(0);
    const [paginateItems, setPaginateItems] = useState<any>([]);
    const [pageCount, setPageCount] = useState(0);
    const [searchList, setSearchList] = useState<any>("");
    const [cancelOrderId, setCancelOrderId] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const reduxData = useSelector((state: any) => state.icon);
    const currencyData = reduxData.currency ? reduxData.currency : "USD"
    const router = useRouter();
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        setUID(localStorage.getItem('userId'));
        if (UID) {
            fetchOrderData();
        }
    }, [UID])

    const fetchOrderData = async () => {
        const usersCollectionRef = query(
            collection(db, "storeUsers"),
            where("id", "==", UID)
        );

        await onSnapshot(usersCollectionRef, async (userSnapshot) => {
            const data = userSnapshot.docs[0]
            const usersCollRef = doc(db, "storeUsers", data.id);
            const orderCollection = collection(db, "Orders");
            const SupplierQuery = query(
                orderCollection,
                where("userRef", "==", usersCollRef),
                orderBy("OrderDate", "desc"),
            );
            await onSnapshot(SupplierQuery, (docQuery) => {
                let newArray: any = []
                docQuery.docs.map((item) => {
                    newArray.push({ ...item.data(), id: item.id })
                })
                setOrderData(newArray);
                setFilteredOrders(newArray);
                setLoading(false);
            })
        });
    }

    const cancelOrder = async (id: string) => {
        const newRef = doc(db, "Orders", id)
        await updateDoc(newRef, {
            orderStatus: "Cancelled"
        })
    }

    useEffect(() => {
        const filteredOrder: any = orderData.filter((order) => {
            if (
                order.id.toLowerCase().includes(searchList)
            ) {
                return order;
            }
        });
        setFilteredOrders(filteredOrder);
        setItemOffset(0);
    }, [searchList])

    useEffect(() => {
        const endOffset = itemOffset + 4;
        const currentItems = filteredOrders.slice(itemOffset, endOffset);
        setPaginateItems(currentItems);
        const pageCount = Math.ceil(filteredOrders.length / 4);
        setPageCount(pageCount);
    }, [filteredOrders, itemOffset])

    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * 4) % filteredOrders.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: "4", md: "8", lg: "12" }}
                py={{ base: "6", md: "8", lg: "12" }}
            >
                {loading ? (
                    <>
                        <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                            <Spinner />
                        </Flex>
                    </>
                ) : (
                    <Stack
                        spacing={{ base: "6", md: "8", lg: "12" }}
                        pb={{ base: "6", md: "8", lg: "12" }}
                    >
                        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">
                                {t("Order.title")}
                            </Text>
                            <InputGroup maxW="xs">
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FiSearch} color="muted" boxSize="5" />
                                </InputLeftElement>
                                <Input placeholder={t("Order.Search")}
                                    value={searchList}
                                    onChange={(e) => {
                                        setSearchList(e.target.value);
                                    }} />
                            </InputGroup>
                        </Stack>
                        {
                            paginateItems.length !== 0 ? (
                                paginateItems && paginateItems.map((data: any, index: number) => {
                                    return (
                                        <Card
                                            direction={{ base: 'column', sm: 'row', md: "row" }}
                                            overflow='hidden'
                                            variant='outline'
                                            alignItems={{ base: "center" }}
                                            width={"100%"}
                                            key={index}
                                        >
                                            <Image
                                                style={{ height: "200px", objectFit: "cover" }}
                                                className="orderImg"
                                                width={150}
                                                height={200}
                                                src={data.products && data.products[0].mainImage}
                                                alt='img'
                                            />
                                            <CardBody py={0}>
                                                <Heading fontSize={{ base: 16, md: 20, xl: 22 }}>{t("OrderDetails.orderId")}: {data.id}</Heading>
                                                <Flex gap={{ sm: 3, md: 5 }} justifyContent={{ sm: "flex-start", md: "flex-start" }} flexDirection={{ base: "column", md: "row" }}>
                                                    <Flex direction={'column'} alignItems={"flex-start"}>
                                                        <Text fontSize={{ md: 14 }}>
                                                            {t("Order.Date")}: {data.OrderDate && new Date(
                                                                data.OrderDate.seconds * 1000
                                                            ).toDateString()}
                                                        </Text>
                                                        <Text fontSize={{ md: 14 }}>
                                                            {t("Order.TotalProducts")}: {data.products?.length}
                                                        </Text>
                                                        <Text fontSize={{ md: 14 }}>
                                                            {t("Order.PaymentStatus")}: {data.paymentStatus}
                                                        </Text>
                                                    </Flex>
                                                    <Flex direction={'column'} alignItems={"flex-start"}>
                                                        <Text fontSize={{ md: 14 }}>
                                                            {t("Order.Name")}: {data.name}
                                                        </Text>
                                                        <Text fontSize={{ md: 14 }}>
                                                            {t("Order.Status")}: {data.orderStatus}
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                                <Flex justifyContent={{ base: "center", sm: "flex-start" }} pb={{ base: 2 }}>
                                                    <Text fontSize={"xl"} fontWeight={"bold"} pt={5}>{t("Order.Total")}: {currencyData === "USD" ? `$${(data.USDTotal)}` : `${currencyData} ${(data.AEDTotal)}`}</Text>
                                                </Flex>
                                            </CardBody>
                                            <Flex gap={{ base: 5, md: 0 }}>
                                                <Button
                                                    mr={{ base: 0, sm: 5, md: 2 }}
                                                    mb={{ base: 4, md: 0 }}
                                                    variant="ghost"
                                                    aria-label="Edit member"
                                                    onClick={() => router.push(`/orderdetails/${data.id}`)}
                                                    className="btn"
                                                    color={"#fff"}
                                                >
                                                    {t("Order.View")}
                                                </Button>
                                                {
                                                    data.orderStatus === "Cancelled" ||
                                                        data.orderStatus === "Delivered" ||
                                                        data.orderStatus === "Completed" ||
                                                        data.paymentStatus === "Pending" ||
                                                        data.paymentStatus === "Cancel"
                                                        ? null :
                                                        <Button
                                                            mr={{ base: 0, sm: 5, md: 5 }}
                                                            mb={{ base: 4, md: 0 }}
                                                            variant="ghost"
                                                            aria-label="Edit member"
                                                            onClick={() => {
                                                                onOpen()
                                                                setCancelOrderId(data.id)
                                                            }}
                                                            className="btn"
                                                            color={"#fff"}
                                                        >
                                                            {t("Order.Cancel")}
                                                        </Button>
                                                }
                                            </Flex>
                                        </Card>
                                    )
                                })
                            ) : (
                                <>
                                    <Flex justifyContent={"center"}>
                                        <Image src={blankImg} alt="blank img" width={300} height={300} />
                                    </Flex>
                                    <Flex alignItems={"center"} flexDirection={"column"}>
                                        <Text fontSize={"lg"}>{t("Order.OrderNotFound")}</Text>
                                        <Button variant={"ghost"} color={"primaryColor"} onClick={() => router.push("/allproducts")}>
                                            {t("Order.ContinueShopping")}
                                        </Button>
                                    </Flex>
                                </>
                            )
                        }
                        <Box px={{ base: '0', md: '6' }} pb="5">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel={">"}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={1}
                                marginPagesDisplayed={1}
                                pageCount={pageCount}
                                previousLabel={"<"}
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </Box>
                    </Stack>
                )}
            </Box >
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight={"normal"}>{t("Order.ConfirmOrder")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter justifyContent={"center"}>
                        <Flex gap={4} mb={4}>
                            <Button onClick={() => {
                                cancelOrder(cancelOrderId);
                                onClose();
                            }}
                            >
                                {t("Order.ConfirmButton")}
                            </Button>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                {t("Order.CancelButton")}
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Orderlist;