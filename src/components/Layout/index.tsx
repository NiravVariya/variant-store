import { Box, Container, Flex, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Logo } from "./Logo";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";
import { setCurrency, setStoreSetData } from "@/store";

interface Props {
  children?: React.ReactNode;
  // any props that come into the component
}

export default function Layout({ children }: Props) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const simpleLayoutURLs = ["/auth/login", "/"];

  let checkCurrent = router.pathname.split('/')

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrency = localStorage.getItem("currency");
    dispatch(setCurrency(fetchCurrency));
  }, [])

  useEffect(() => {
    const fetchStoreSettingData = () => {
      const newdocRef = collection(db, "storeSetting");
      onSnapshot(newdocRef, (querydata) => {
        querydata.docs.map((item: any) => {
          dispatch(setStoreSetData(item.data()))
        })
      });
    }
    fetchStoreSettingData();
  }, [])

  return (
    <>
      {checkCurrent.includes('admin') ? (
        <>
          <Flex
            as="section"
            direction={{ base: "column", lg: "row" }}
            height="100vh"
            bg="bg-canvas"
            overflowY="auto"
          >
            {isDesktop ? <Sidebar /> : <Navbar />}

            <Container py="8" flex="1" position={"relative"}>
              <Box as="section" py={{ base: "4", md: "8" }} height={{ base: "auto", sm: "89vh" }} overflow={"scroll"} className="sidebarOverFlow" >
                {children}
              </Box>
              {/* <Stack position={"absolute"} right={0} bottom={0}>
                <Flex alignItems={"center"} justifyContent={"flex-end"} flexDirection={"row"}>
                  <Text opacity={0.5} fontSize={12}>Powered by </Text>
                  <Logo width={180} />
                </Flex>
              </Stack> */}
            </Container>
          </Flex>
        </>
      ) : (
        children
      )}
    </>
  );
}
