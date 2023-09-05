import { useUserContext } from "@/context/UserContext";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  As,
  Avatar,
  Box,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome, FiSettings, FiShoppingBag, FiUsers } from "react-icons/fi";
import { MdCategory, MdContacts, MdMenuBook, MdOutlinePrivacyTip, MdOutlineSettingsSuggest } from "react-icons/md";
import { MdWidgets } from "react-icons/md";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { BsGraphUp } from "react-icons/bs";

type NavLink = {
  icon: As;
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
  { label: "Users", icon: FiUsers, href: "/admin/users" },
  { label: "Categories", icon: MdCategory, href: "/admin/categories" },
  { label: "Products", icon: MdWidgets, href: "/admin/products" },
  { label: "Orders", icon: FiShoppingBag, href: "/admin/orders" },
  { label: "Contact Us", icon: MdContacts, href: "/admin/contactus" },
  { label: "Store Setting", icon: MdOutlineSettingsSuggest, href: "/admin/storesetting" },
  { label: "Privacy Policy", icon: MdOutlinePrivacyTip, href: "/admin/privacy-policy" },
  { label: "Terms & Condition", icon: MdMenuBook, href: "/admin/terms-conditions" },
];

const NavLinks = ({ navLinks, onClose }: { navLinks: NavLink[], onClose: any }) => {
  const { pathname } = useRouter();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();

  return (
    <>
      <Accordion defaultIndex={[0]} allowToggle>
        <AccordionItem border={"none"}>
          <h2>
            <Flex
              alignItems={"center"}
              onClick={() => router.push("/admin/dashboard")}
              bg={router.pathname == "/admin/dashboard" ? "#EDF2F7" : null}
              borderRadius={8}
              _hover={{ bg: "#EDF2F7" }}
            >
              <Icon as={FiHome} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Dashboard
                </Box>
              </AccordionButton>
            </Flex>
          </h2>
        </AccordionItem>
        <AccordionItem border={"none"}>
          <h2>
            <Flex
              alignItems={"center"}
              onClick={() => router.push("/admin/users")}
              bg={router.pathname == "/admin/users" ? "#EDF2F7" : null}
              borderRadius={8}
              _hover={{ bg: "#EDF2F7" }}
            >
              <Icon as={FiUsers} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Users
                </Box>
              </AccordionButton>
            </Flex>
          </h2>
        </AccordionItem>
        <AccordionItem border={"none"}>
          <h2>
            <Flex alignItems={"center"} _hover={{ bg: "#EDF2F7" }}>
              <Icon as={MdWidgets} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Products
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Flex>
          </h2>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/products")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/products" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Products
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/categories")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/categories" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Categories
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem border={"none"}>
          <h2>
            <Flex
              alignItems={"center"}
              onClick={() => router.push("/admin/orders")}
              bg={router.pathname == "/admin/orders" ? "#EDF2F7" : null}
              borderRadius={8}
              _hover={{ bg: "#EDF2F7" }}
            >
              <Icon as={FiShoppingBag} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Orders
                </Box>
              </AccordionButton>
            </Flex>
          </h2>
        </AccordionItem>
        <AccordionItem border={"none"}>
          <h2>
            <Flex
              alignItems={"center"}
              onClick={() => router.push("/admin/sales")}
              bg={router.pathname == "/admin/sales" ? "#EDF2F7" : null}
              borderRadius={8}
              _hover={{ bg: "#EDF2F7" }}
            >
              <Icon as={BsGraphUp} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Sales
                </Box>
              </AccordionButton>
            </Flex>
          </h2>
        </AccordionItem>
        <AccordionItem border={"none"}>
          <h2>
            <Flex alignItems={"center"} _hover={{ bg: "#EDF2F7" }}>
              <Icon as={MdOutlineSettingsSuggest} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Store Setting
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Flex>
          </h2>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/logoAndColors")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/logoAndColors" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Logo & Branding Colors
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/homepage")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/homepage" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Homepage
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/customDomain")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/customDomain" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Custom Domain
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/aboutus")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/aboutus" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            About Us
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/contact&footer")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/contact&footer" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Contact & Footer Info
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/paymentOptions")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/paymentOptions" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Payment Options
          </AccordionPanel>
          <AccordionPanel
            pb={1}
            onClick={() => router.push("/admin/storesetting/terms&privacy")}
            cursor={"pointer"}
            bg={router.pathname == "/admin/storesetting/terms&privacy" ? "#EDF2F7" : null}
            borderRadius={5}
          >
            Terms & Privacy
          </AccordionPanel>
        </AccordionItem>
        {/* <AccordionItem border={"none"}>
          <h2>
            <Flex
              alignItems={"center"}
              onClick={() => router.push("/admin/contactus")}
              bg={router.pathname == "/admin/contactus" ? "#EDF2F7" : null}
              borderRadius={8}
              _hover={{ bg: "#EDF2F7" }}
            >
              <Icon as={MdContacts} height={45} width={30} pl={1} color="subtle" />
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Contact Us
                </Box>
              </AccordionButton>
            </Flex>
          </h2>
        </AccordionItem> */}
      </Accordion>
    </>
  );
};

export const Sidebar = (props: any) => {
  const { user } = useUserContext();
  const router = useRouter();

  const [data, setData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const userID = localStorage.getItem("AdminUserID");
    if (userID) {
      let q: any = query(collection(db, "storeUsers"), where("id", "==", userID));
      onSnapshot(q, async (querySnapshot: any) => {
        let idRef: string = querySnapshot?.docs[0]?.id
        const newRef = doc(db, "storeUsers", idRef);
        const docSnap = await getDoc(newRef);
        if (docSnap.exists()) {
          const docData: any = docSnap.data();
          setData(docData);
        }
      })
    }
  }, [])


  return (
    <Flex as="section" minH="100vh" bg="bg-canvas">
      <Flex
        flex="1"
        bg="bg-surface"
        overflowY="auto"
        boxShadow={useColorModeValue("sm", "sm-dark")}
        maxW={{ base: "full", sm: "xs" }}
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <Logo width={200} />
            <Stack spacing="1">
              <NavLinks navLinks={navLinks} onClose={props.onclose} />
            </Stack>
          </Stack>
          <Stack spacing={{ base: "5", sm: "6" }}>
            <Flex justifyContent={"space-between"}>
              <Accordion defaultIndex={[0]} allowToggle>
                <AccordionItem border={"none"}>
                  <h2>
                    <Flex
                      alignItems={"center"}
                      onClick={() => router.push("/admin/settings")}
                      bg={router.pathname == "/admin/settings" ? "#EDF2F7" : null}
                      borderRadius={8}
                      _hover={{ bg: "#EDF2F7" }}
                    >
                      <Icon as={FiSettings} height={45} width={30} pl={1} color="subtle" />
                      <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                          Settings
                        </Box>
                      </AccordionButton>
                    </Flex>
                  </h2>
                </AccordionItem>
              </Accordion>
              <Link href={"/admin/profile"} passHref key={"Settings"}>
                <Avatar
                  name={data.name}
                  src={data.image}
                  boxSize="10"
                />
              </Link>
            </Flex>
            <Divider />
            <Flex
              alignItems={"center"}
              justifyContent={"flex-end"}
              flexDirection={"row"}
            >
              <Text opacity={0.5} fontSize={12}>
                Powered by{" "}
              </Text>
              <Logo width={120} />
            </Flex>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
