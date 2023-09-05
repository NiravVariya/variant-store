import { Container, Flex, Heading, ListItem, Spinner, Text, UnorderedList } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
// import { logFirebaseEvent } from "services/coach_service";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

const PrivacyPage = () => {
    const title = `LVLUP | Privacy Policy`;
    const url = `https://lvlup-app.com/privacy`;

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
            const newdocRef = collection(db, "storeSetting", storeDocId, "PrivacyPolicy");
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
                title="Privacy Policy"
                description="We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. - lvlup-app.com"
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
                                    {t("PrivacyPolicy.Title")}
                                </Heading>
                                {/* <Text fontSize="sm">{storeData && storeData.data}</Text> */}
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

export default PrivacyPage;
