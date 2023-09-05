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
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Flex,
  Button,
  Stack,
} from "@chakra-ui/react";
import { db } from "@/firebase/client";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Box, Select, Spinner } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";
import orderBlankImg from "@/assets/OrderEmpty.svg"
import Image from "next/image";

function Orders() {
  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchList, setSearchList] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paginateItems, setPaginateItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const router = useRouter();

  const handleChangeStatus = async (id: string, status: string) => {
    if (id) {
      const updateOrderRef = doc(db, "Orders", id);
      await updateDoc(updateOrderRef, {
        orderStatus: status,
      }).then(() => {
        toast.success("Order Status Updated successfully");
      });
    }
  };

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
        setFilteredOrders(OrdersArr);
        setIsLoading(false);
      }, 1000);
    });
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    fetchOrders();
  }, []);

  useEffect(() => {
    const filteredOrder: any = totalOrders.filter((order) => {
      if (order.id.includes(searchList)) {
        return order;
      }
    });
    setFilteredOrders(filteredOrder);
    setItemOffset(0);
  }, [searchList]);

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

  return (
    <>
      <Flex justifyContent={"flex-end"} mb={10}>
        <InputGroup maxW="xs">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="muted" boxSize="5" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            _focus={{ borderColor: "#242F51" }}
            value={searchList}
            onChange={(e) => {
              setSearchList(e.target.value);
            }}
          />
        </InputGroup>
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
      ) : totalOrders.length != 0 ? (
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
                <Th align="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginateItems &&
                paginateItems.map((item, index) => {
                  let disabled = true;
                  switch (item.paymentStatus) {
                    case "Success":
                      if (item.orderStatus === "Completed") {
                        disabled = true;
                      } else {
                        disabled = false;
                      }
                      break;
                    case "Cash On Delivery":
                      if (item.orderStatus === "Completed") {
                        disabled = true;
                      } else {
                        disabled = false;
                      }
                      break;
                    case "Pending":
                      if (item.paymentStatus === "Pending") {
                        disabled = true;
                      } else {
                        disabled = false;
                      }
                      break;
                    default:
                      disabled = false;
                      break;
                  }
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
                      <Td>
                        {item.orderStatus != "Cancelled" ? (
                          <Select
                            placeholder="Status"
                            value={item.orderStatus}
                            disabled={disabled}
                            width={130}
                            onChange={(e) => {
                              handleChangeStatus(item.id, e.target.value);
                            }}
                          >
                            <option value="Accepted">Accepted</option>
                            <option value="On its way">On its way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                          </Select>
                        ) : (
                          ""
                        )}
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (<>
        <Flex flexDirection={"column"} alignItems={"center"} gap={6}>
          <Image src={orderBlankImg} alt="blank img" width={200} height={200} />
          <Stack>
            <Text fontSize="2xl" fontWeight={"bold"} textAlign="center">
              Your orders will show here
            </Text>
            <Text px={"20%"} textAlign={"center"}>The order page currently has no orders to display. If user place an order, it will be displayed here.</Text>
          </Stack>
        </Flex>
      </>)}
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

export default WithAuth(Orders, USER_TYPE.Admin);
