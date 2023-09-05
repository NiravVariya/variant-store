import { db } from "@/firebase/client";
import { Box, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import blankImg from "@/assets/empty.svg";
import useTranslation from "@/hooks/useTranslation";

const AboutUs = () => {

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
            const newdocRef = collection(db, "storeSetting", storeDocId, "AboutUs");
            onSnapshot(newdocRef, (querydata) => {
                querydata.docs.map((item: any) => {
                    setStoreData(item.data())
                    setLoading(false);
                })
                setLoading(false);
            });
        }
    }, [storeDocId])

    return (
        <Box
            maxW={{ base: "3xl", lg: "7xl" }}
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "150" }}
        >
            <Stack alignItems={"center"} spacing={{ base: '6', md: '5' }}>
                {loading && <>
                    <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                        <Spinner />
                    </Flex>
                </>}
                {!loading && (storeData.length != 0 ? (
                    <>
                        <Heading size="md">{storeData && storeData.title && storeData.title[locale]}</Heading>
                        <Text padding={5} textAlign={"center"}>{storeData && storeData.desc && storeData.desc[locale]}</Text>
                        <Stack marginTop={10}>
                            <Flex gap={5} direction={{ base: 'column', md: 'row' }} marginTop={20}>
                                <Image width={400} height={300} src={storeData && storeData.aboutImges && storeData.aboutImges[0]} alt=""></Image>
                                <Image width={400} height={300} src={storeData && storeData.aboutImges && storeData.aboutImges[1]} alt=""></Image>
                            </Flex>
                        </Stack>
                    </>
                ) : (
                    <>
                        <Flex justifyContent={"center"}>
                            <Image src={blankImg} alt="blank img" width={300} height={300} />
                        </Flex>
                        <Flex alignItems={"center"} flexDirection={"column"}>
                            <Text fontSize={"lg"}>{t("AboutUS.DataNotFound")}</Text>
                        </Flex>
                    </>
                ))}
            </Stack>
        </Box>
    );
};

export default AboutUs;