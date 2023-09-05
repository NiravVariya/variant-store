import "../styles/globals.css";
import { theme as proTheme } from "@chakra-ui/pro-theme"; // when using npm
import {
  ChakraProvider,
  extendTheme,
  theme as baseTheme,
  Flex,
  Text,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import { Toaster, toast } from "react-hot-toast";
import "react-multi-carousel/lib/styles.css";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";

import { UserContextComp } from "../context/UserContext";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import store, { setCart } from "../store/index";
import { storeData } from "@/components/Common/storeData";
import { useEffect, useState } from "react";
import { RtlProvider } from "@/components/rtl-provider";
import axios from "axios";
import Image from "next/image";
import dataImage from "../assets/Group 37.svg";
import firebaseConfig from "../firebase/firebaseConfig.json";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<any>({});

  const [storeDueDate, setStoreDueDate] = useState<number>(0);
  const date = new Date().getTime();

  const router = useRouter()

  useEffect(() => {
    function getUserPreference() {
      const preferenceData = localStorage.getItem("cartData");
      return preferenceData ? JSON.parse(preferenceData) : {};
    }

    const userPreference = getUserPreference();
    store.dispatch(setCart(userPreference));
  }, [router])

  const getApi = async () => {
    if (!firebaseConfig.stripeId) {
      toast.error("stripeId not found!");
    }

    var config = {
      method: "get",
      url: `https://vindyy.com/api/check-subscription/${firebaseConfig?.stripeId}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then(function (response: any) {
        console.log("response===============>", response);

        const date = response.data.subData[0]?.current_period_end
        function secondsToMilliseconds(date: any) {
          return date * 1000;
        }
        const milliseconds = secondsToMilliseconds(date);
        setStoreDueDate(milliseconds);
      })
      .catch(function (error: any) {
        console.log("err======>", error);
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  // const getApi = async () => {
  //   if (!firebaseConfig.storeId) {
  //     toast.error("StoreId not found!");
  //   }

  //   var config = {
  //     method: "get",
  //     url: `https://vindyy.com/api/store/${firebaseConfig?.storeId}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   await axios(config)
  //     .then(function (response: any) {
  //       setStoreDueDate(response.data.data);
  //     })
  //     .catch(function (error: any) {
  //       console.log("err======>", error);
  //     });
  // };

  // useEffect(() => {
  //   getApi();
  // }, []);

  useEffect(() => {
    storeData((info: any) => {
      setData(info);
    });
  }, []);

  let primarycolor = data.primaryColor;
  let secondaryColor = data.secondaryColor;

  const theme = extendTheme(
    {
      colors: {
        ...baseTheme.colors,
        primaryColor: primarycolor ? primarycolor : "#242F51",
        secondaryColor: secondaryColor ? secondaryColor : "#384878",
        brand: {
          "50": "#FFE5EC",
          "100": "#FFB8CB",
          "200": "#FF8AAA",
          "300": "#FF5C88",
          "400": "#FF2E67",
          "500": "#FF0046",
          "600": "#CC0038",
          "700": "#99002A",
          "800": "#66001C",
          "900": "#33000E",
        },
        // brand: baseTheme.colors.green,
      },
      styles: {
        global: {
          // styles for the `body`
          body: {
            fontFamily: "Nunito, sans-serif !important",
          },
        },
      },
    },

    proTheme
  );

  return (
    <ChakraProvider theme={theme}>
      <UserContextComp>
        <DefaultSeo {...SEO} />
        <Provider store={store}>
          <Layout>
            <RtlProvider>
              {storeDueDate <= date ? (
                <>
                  {storeDueDate !== 0 && (
                    <Flex
                      alignItems={"center"}
                      pt={"12rem"}
                      flexDirection={"column"}
                    >
                      <Image src={dataImage} alt="" width={500} />
                      <Text fontSize={{ base: "smaller", md: "xl" }} pt={10}>
                        Your store subscription is expired, Please renew it to enjoy our services.
                      </Text>
                    </Flex>
                  )}
                </>
              ) : (
                <Component {...pageProps} />
              )}
            </RtlProvider>
          </Layout>
        </Provider>
        <Toaster position="bottom-center" reverseOrder={false} />
      </UserContextComp>
    </ChakraProvider>
  );
}
