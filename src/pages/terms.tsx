import { Container, Flex, Heading, ListItem, Spinner, Text, UnorderedList } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

const TermsPage = () => {
    const title = `LVLUP | Terms of use`;
    const url = `https://lvlup-app.com/terms`;

    const [storeData, setStoreData] = useState<any>([])
    const [storeDocId, setStoreDocId] = useState("")
    const [loading, setLoading] = useState(true);
    const { locale } = useRouter();
    const { t } = useTranslation();

    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap) => {
        settingSnap.docs.map((value) => {
            const dataref: any = doc(db, "storeSetting", value.id);
            setStoreDocId(dataref.id);
        });
    });

    useEffect(() => {
        if (storeDocId) {
            const newdocRef = collection(db, "storeSetting", storeDocId, "TermsAndConditions");
            const productsQueryRef = query(
                newdocRef,
                orderBy("createdAt", "asc")
            );
            onSnapshot(productsQueryRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item: any) => {
                    newArray.push({ ...item.data() })
                    setLoading(false);
                })
                setStoreData(newArray)
            });
        }
    }, [storeDocId])

    return (
        <>
            <App />
            <NextSeo
                title="Terms of use"
                description="Please read these terms and conditions carefully before using Our Service. - lvlup-app.com"
                canonical={url}
                openGraph={{
                    url,
                    title,
                }}
            />
            <Flex flexDir="column" alignItems={"center"} flexGrow={1}>
                {loading && <>
                    <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                        <Spinner />
                    </Flex>
                </>}
                {!loading && (
                    <>
                        <Container maxW="container.lg">
                            <Flex flexDir="column" as="main" alignItems="center" pt={20} pb={4}>
                                <Heading as="h1" p={[2, 2, 6]} textAlign="center">
                                    {t("TermsAndConditions.Title")}
                                </Heading>
                                {/* <Text fontSize="sm">Last updated: January 17, 2022</Text> */}
                            </Flex>
                        </Container>
                    </>
                )}
            </Flex>
            {
                storeData && storeData.map((data: any, index: any) => {
                    return (<>
                        <Container maxW="container.xl" key={index}>
                            <Heading as="h6" textAlign="start" fontSize={"30px"}>
                                {data.title[locale]}
                            </Heading>
                            <Text mb={10}>
                                {data.description[locale]}
                            </Text>
                        </Container>
                    </>)
                })
            }
            <Footer />
        </>
    );
};

export default TermsPage;
