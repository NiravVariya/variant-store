import React, { useEffect, useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Flex,
    Button,
    Stack,
} from "@chakra-ui/react";
import { db } from "@/firebase/client";
import {
    collection,
    onSnapshot,
    getDoc,
    query,
    orderBy,
    getDocs,
} from "firebase/firestore";
import { Box, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { where, getFirestore, Timestamp } from 'firebase/firestore';
import Image from "next/image";
import orderBlankImg from "@/assets/Sales Empty.svg"

function Sales() {
    const [totalOrders, setTotalOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [paginateItems, setPaginateItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const router = useRouter();
    const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

    const fetchOrders = async () => {
        const OrdersQuery = collection(db, "Orders");
        const OrdersQueryRef = query(OrdersQuery, orderBy("OrderDate", "desc"));
        await onSnapshot(OrdersQueryRef, (ordersSnapshot) => {
            const OrdersArr: any[] = [];
            ordersSnapshot.docs.map(async (value) => {
                const docSnap = await getDoc(value.data().userRef);
                if (docSnap.exists()) {
                    OrdersArr.push({
                        ...value.data(),
                        id: value.id,
                        UserRef: docSnap.data(),
                    });
                } else {
                    console.log("user Not found");
                }
            });

            setTimeout(() => {
                setTotalOrders(OrdersArr);
                // setFilteredOrders(OrdersArr);
                setIsLoading(false);
            }, 1000);
        });
    };

    useEffect(() => {
        const db = getFirestore();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const ordersRef = collection(db, 'Orders');
        const filteredQuery = query(ordersRef, orderBy("OrderDate", "desc"),
            where('OrderDate', '>=', startTimestamp),
            where('OrderDate', '<=', endTimestamp));

        getDocs(filteredQuery)
            .then((querySnapshot) => {
                const OrdersArr: any[] = [];
                querySnapshot.forEach(async (value) => {
                    const docSnap = await getDoc(value.data().userRef);
                    if (docSnap.exists()) {
                        OrdersArr.push({
                            ...value.data(),
                            id: value.id,
                            UserRef: docSnap.data(),
                        });
                    } else {
                        console.log("user Not found");
                    }
                });
                setTimeout(() => {
                    setFilteredOrders(OrdersArr);
                    setIsLoading(false);
                }, 1000);
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });
    }, [])

    useEffect(() => {
        const adminAuth = localStorage.getItem("isAdmin");
        adminAuth ? null : router.push("/auth/login");
        fetchOrders();
    }, []);

    useEffect(() => {
        const endOffset = itemOffset + 5;
        const currentItems = filteredOrders.slice(itemOffset, endOffset);
        setPaginateItems(currentItems);
        const pageCount = Math.ceil(filteredOrders.length / 5);
        setPageCount(pageCount);
    }, [filteredOrders, itemOffset]);

    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * 5) % filteredOrders.length;
        setItemOffset(newOffset);
    };

    useEffect(() => {
        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        const filteredItems: any = totalOrders.filter((item: any) => {
            const orderDate = new Date(item.OrderDate.seconds * 1000);
            return orderDate >= startDate && orderDate <= endDate;
        });
        setFilteredOrders(filteredItems);
    }, [selectedDates])

    return (
        <>
            <Flex justifyContent={"flex-end"} ml={"auto"} mb={10} width={"30%"}>
                <RangeDatepicker
                    selectedDates={selectedDates}
                    onDateChange={setSelectedDates}
                />
            </Flex>
            {isLoading ? (
                <Box textAlign="center">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="#00b2fe75"
                        size="xl"
                    />
                </Box>
            ) : filteredOrders.length != 0 ? (
                <TableContainer mb={10}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th align="left">ID</Th>
                                <Th align="left">User Name</Th>
                                <Th align="left">Total in USD</Th>
                                <Th align="left">Payment Status</Th>
                                <Th align="left">View Order</Th>
                                <Th align="left">Order Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginateItems &&
                                paginateItems.map((item, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{itemOffset + (index + 1)}. {item.id}</Td>
                                            <Td>{item.name}</Td>
                                            <Td>{item.USDTotal}</Td>
                                            <Td>
                                                <Text
                                                    bg={
                                                        item.paymentStatus == "Success"
                                                            ? "green.200"
                                                            : item.paymentStatus == "Panding"
                                                                ? "red.200"
                                                                : "yellow.200"
                                                    }
                                                    width={"fit-content"}
                                                    px={5}
                                                    py={1}
                                                    borderRadius={50}
                                                >
                                                    {item.paymentStatus}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Button variant="primary" onClick={() => router.push(`/admin/orderdetails/${item.id}`)}>
                                                    View
                                                </Button>
                                            </Td>
                                            <Td>
                                                <Text
                                                    bg={
                                                        item.orderStatus == "Completed"
                                                            ? "green.400"
                                                            : item.orderStatus == "Delivered"
                                                                ? "green.200"
                                                                : item.orderStatus == "Cancelled"
                                                                    ? "red.200"
                                                                    : item.orderStatus == "Accepted"
                                                                        ? "purple.200"
                                                                        : item.orderStatus == "On its way" ? "orange.200" : "blue.200"
                                                    }
                                                    width={"fit-content"}
                                                    px={5}
                                                    py={1}
                                                    borderRadius={50}
                                                >
                                                    {item.orderStatus}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <Flex flexDirection={"column"} alignItems={"center"} gap={6}>
                    <Image src={orderBlankImg} alt="blank img" width={200} height={200} />
                    <Stack>
                        <Text fontSize="2xl" fontWeight={"bold"} textAlign="center">
                            Your orders will show here
                        </Text>
                        <Text px={"20%"} textAlign={"center"}>The order page currently has no orders to display. If user place an order, it will be displayed here.</Text>
                    </Stack>
                </Flex>
            )}
            <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel="<<"
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
        </>
    );
}

export default WithAuth(Sales, USER_TYPE.Admin);
