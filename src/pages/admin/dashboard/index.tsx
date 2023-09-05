import React, { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { useRouter } from "next/router";
import {
  collection,
  getCountFromServer,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  Progress,
  Radio,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { FiShoppingBag, FiUsers } from "react-icons/fi";
import { MdCategory, MdWidgets } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";
import SalesCart from "../../../components/Admin/SalesCart/SalesCart"
import AllMonthSalesCart from "@/components/Admin/SalesCart/AllMonthSalesCart";
import { ImRadioUnchecked, ImRadioChecked } from "react-icons/im";
import themeImage from "@/assets/Store theme.svg";
import manageProductImage from "@/assets/Manage Product.svg";
import customDomainImage from "@/assets/Custom Domain.svg";
import contentImage from "@/assets/Content.svg";
import Image from "next/image";
import Progressbar from "@/components/Admin/Progressbar";

interface CountType {
  user: number,
  category: number,
  product: number,
  order: number,
}

function Dashboard() {
  const route = useRouter();
  const [count, setCount] = useState<CountType>({
    user: 0,
    category: 0,
    product: 0,
    order: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState<any[]>([]);

  function getCurrentMonth() {
    const date = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = date.getMonth();
    return monthNames[month];
  }
  const currentMonth = getCurrentMonth();

  const fetchcount = async () => {
    const UserQuery = collection(db, "storeUsers");
    const categoryQuery = collection(db, "Categories");
    const ProductQuery = collection(db, "storeProducts");
    const OrderQuery = collection(db, "Orders");

    const userSnap = await getCountFromServer(UserQuery);
    const categorySnap = await getCountFromServer(categoryQuery);
    const ProductSnap = await getCountFromServer(ProductQuery);
    const orderSnap = await getCountFromServer(OrderQuery);

    setCount({
      user: userSnap.data().count,
      category: categorySnap.data().count,
      product: ProductSnap.data().count,
      order: orderSnap.data().count,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : route.push("/auth/login");
    fetchcount();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const OrdersQuery = collection(db, "Orders");
      await onSnapshot(OrdersQuery, (ordersSnapshot) => {
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
        }, 1000);
      });
    };
    fetchOrders();
  }, []);

  const orders = totalOrders;
  const currentMonthh = new Date().getMonth() + 1;

  let totalUSDAmount = 0;

  orders.forEach(order => {
    const orderDate = new Date(order.OrderDate.seconds * 1000);
    const orderMonth = orderDate.getMonth() + 1;

    if (orderMonth === currentMonthh) {
      totalUSDAmount += order.USDTotal;
    }
  });

  return (<>
    <div>
      <Accordion
        defaultIndex={[0]}
        allowMultiple
        bg={"bg-surface"}
        mb={4}
        borderRadius={"xl"}
        border="1px solid rgba(0, 0, 0, 0.1)"
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                <Text fontSize={"xl"} fontWeight={"semibold"}>
                  Setup guide
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>Use this personalized guide to get your store up and running.</Text>
            <Flex alignItems={"center"} gap={10} my={3}>
              <Progressbar />
            </Flex>
            <Accordion allowToggle>
              <AccordionItem>
                {({ isExpanded }) => (<>
                  <h2>
                    <AccordionButton>
                      {isExpanded ? (
                        <ImRadioChecked fontSize={"20px"} />
                      ) : (
                        <ImRadioUnchecked fontSize={"20px"} />
                      )}
                      <Box as="span" flex='1' textAlign='left'>
                        <Text ml={3}>
                          Customize your store theme
                        </Text>
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                      <Flex flexDirection={"column"} gap={4}>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          Choose a theme color and add your store logo
                        </Text>
                        <Button
                          fontSize={{ base: "sm", md: "md" }}
                          variant={"primary"}
                          width={{ base: "auto", md: "50%" }}
                          onClick={() => route.push("/admin/storesetting/logoAndColors")}
                        >
                          Customize theme
                        </Button>
                      </Flex>
                      <Image src={themeImage} alt="" width={250} />
                    </Flex>
                  </AccordionPanel>
                </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (<>
                  <h2>
                    <AccordionButton>
                      {isExpanded ? (
                        <ImRadioChecked fontSize={"20px"} />
                      ) : (
                        <ImRadioUnchecked fontSize={"20px"} />
                      )}
                      <Box as="span" flex='1' textAlign='left'>
                        <Text ml={3}>
                          Manage your products
                        </Text>
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                      <Flex flexDirection={"column"} gap={4}>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          Choose a theme color and add your store logo
                        </Text>
                        <Button
                          fontSize={{ base: "sm", md: "md" }}
                          variant={"primary"}
                          width={{ base: "auto", md: "50%" }}
                          onClick={() => route.push("/admin/products/addproduct")}
                        >
                          Add product
                        </Button>
                      </Flex>
                      <Image src={manageProductImage} alt="" width={200} />
                    </Flex>
                  </AccordionPanel>
                </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (<>
                  <h2>
                    <AccordionButton>
                      {isExpanded ? (
                        <ImRadioChecked fontSize={"20px"} />
                      ) : (
                        <ImRadioUnchecked fontSize={"20px"} />
                      )}
                      <Box as="span" flex='1' textAlign='left'>
                        <Text ml={3}>
                          Add a custom domain
                        </Text>
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                      <Flex flexDirection={"column"} gap={4}>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          Choose a theme color and add your store logo
                        </Text>
                        <Button
                          fontSize={{ base: "sm", md: "md" }}
                          variant={"primary"}
                          width={{ base: "auto", md: "50%" }}
                          onClick={() => route.push("/admin/storesetting/customDomain")}
                        >
                          Add Domain
                        </Button>
                      </Flex>
                      <Image src={customDomainImage} alt="" width={200} />
                    </Flex>
                  </AccordionPanel>
                </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (<>
                  <h2>
                    <AccordionButton>
                      {isExpanded ? (
                        <ImRadioChecked fontSize={"20px"} />
                      ) : (
                        <ImRadioUnchecked fontSize={"20px"} />
                      )}
                      <Box as="span" flex='1' textAlign='left'>
                        <Text ml={3}>
                          Add content
                        </Text>
                      </Box>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                      <Flex flexDirection={"column"} gap={4}>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                          Choose a theme color and add your store logo
                        </Text>
                        <Button
                          fontSize={{ base: "sm", md: "md" }}
                          variant={"primary"}
                          width={{ base: "auto", md: "50%" }}
                          onClick={() => route.push("/admin/storesetting/homepage")}
                        >
                          Add content
                        </Button>
                      </Flex>
                      <Image src={contentImage} alt="" width={200} />
                    </Flex>
                  </AccordionPanel>
                </>
                )}
              </AccordionItem>
            </Accordion>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      >
        {/* <Card>
          <CardBody>
            <FiUsers />
            <Text fontSize="3xl">Total Users</Text>
            <Text fontSize="3xl">{!isLoading ? count.user : <Spinner />}</Text>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="primary"
              marginTop={3}
              onClick={() => {
                route.push({ pathname: "/admin/users" });
              }}
            >
              View here
            </Button>
          </CardBody>
        </Card> */}
        {/* <Card>
          <CardBody>
            <MdCategory />
            <Text fontSize="3xl">
              <Text fontSize="3xl">Total Categories</Text>
              {!isLoading ? count.category : <Spinner />}
            </Text>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="primary"
              marginTop={3}
              onClick={() => {
                route.push({ pathname: "/admin/categories" });
              }}
            >
              View here
            </Button>
          </CardBody>
        </Card> */}
        <Card
          borderRadius={"xl"}
          border="1px solid rgba(0, 0, 0, 0.1)"
        >
          <CardBody>
            <MdWidgets />
            <Text fontSize="3xl">Total Products</Text>
            <Text fontSize="3xl">
              {!isLoading ? count.product : <Spinner />}
            </Text>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="primary"
              marginTop={3}
              onClick={() => {
                route.push({ pathname: "/admin/products" });
              }}
            >
              View here
            </Button>
          </CardBody>
        </Card>
        <Card
          borderRadius={"xl"}
          border="1px solid rgba(0, 0, 0, 0.1)"
        >
          <CardBody>
            <FiShoppingBag />
            <Text fontSize="3xl">Total Orders</Text>
            <Text fontSize="3xl">{!isLoading ? count.order : <Spinner />}</Text>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="primary"
              marginTop={3}
              onClick={() => {
                route.push({ pathname: "/admin/orders" });
              }}
            >
              View here
            </Button>
          </CardBody>
        </Card>
        <Card
          borderRadius={"xl"}
          border="1px solid rgba(0, 0, 0, 0.1)"
        >
          <CardBody>
            <BsGraphUp />
            <Text fontSize="3xl">{currentMonth} sales</Text>
            <Text fontSize="3xl">{!isLoading ? `${totalUSDAmount}USD` : <Spinner />}</Text>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="primary"
              marginTop={3}
              onClick={() => {
                route.push({ pathname: "/admin/sales" });
              }}
            >
              View here
            </Button>
          </CardBody>
        </Card>
      </SimpleGrid>
      <Flex gap={6} flexDirection={{ base: "column", md: "row" }}>
        <SalesCart />
        <AllMonthSalesCart />
      </Flex>
    </div>
  </>);
}

export default WithAuth(Dashboard, USER_TYPE.Admin);