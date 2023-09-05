import React, { useEffect, useState } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { ProductCard } from "@/components/subCategories/ProductCard";
import { Box, Flex, Heading, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { Footer } from "@/components/Footer/Footer";
import { db } from "@/firebase/client";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import blankImg from "@/assets/empty.svg";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

function CategorieId() {
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [spinner, setSpinner] = useState(true);
    const router = useRouter();
    const { categorieId }: any = router.query;
    const { t } = useTranslation();

    useEffect(() => {
        if (categorieId) {
            const newdocRef = collection(db, "Categories", categorieId, "Subcategory");
            const productsQueryRef = query(
                newdocRef,
                orderBy("createdAt", "asc")
            );
            onSnapshot(productsQueryRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item: any) => {
                    newArray.push({ ...item.data(), id: item.id })
                    setSpinner(false);
                })
                setSubCategories(newArray)
                setSpinner(false);
            });
        }
    }, [categorieId])

    return (
        <div>
            <App />
            {spinner ? (
                <>
                    <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                        <Spinner />
                    </Flex>
                </>
            ) : (
                <>
                    <Box
                        maxW="7xl"
                        mx="auto"
                        px={{ base: "4", md: "8", lg: "12" }}
                        py={{ base: "6", md: "8", lg: "12" }}
                    >
                        <Heading size={{ base: "sm", md: "md" }} mb={5}>{t("SubCategorie.title")}</Heading>
                        <Stack
                            spacing={{ base: "6", md: "8", lg: "12" }}
                            pb={{ base: "6", md: "8", lg: "12" }}
                        >
                            {
                                subCategories.length != 0 ? (
                                    <SimpleGrid
                                        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                                        gap={{ base: "8", lg: "10" }}
                                    >
                                        {subCategories.map((data, index) => {
                                            return <ProductCard key={index} product={data} categorieId={categorieId} />;
                                        })}
                                    </SimpleGrid>
                                ) : (
                                    <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
                                        <Image src={blankImg} alt="blank img" width={400} height={400} />
                                        <Text>{t("SubCategorie.NotFound")}</Text>
                                    </Flex>
                                )
                            }
                        </Stack>
                    </Box>
                </>
            )}
            <Footer />
        </div>
    );
};

export default CategorieId;