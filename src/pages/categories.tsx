import React, { useEffect, useState } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { ProductCard } from "@/components/ProductCategories/ProductCard";
import { Box, Flex, Heading, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { Footer } from "@/components/Footer/Footer";
import { db } from "@/firebase/client";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import Image from "next/image";
import blankImg from "@/assets/empty.svg";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<any[]>([]);
  const [spinner, setSpinner] = useState(true);
  const { locale } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllCategories = async () => {
      const categoryQuery = collection(db, "Categories");
      const categoryQueryRef = query(categoryQuery, orderBy("createdAt", "desc"));
      await onSnapshot(categoryQueryRef, (categorySnapshot) => {
        const categoryarr: any[] = [];
        categorySnapshot.docs.map((category) => {
          const categorydata = category.data();
          categorydata.id = category.id;
          categoryarr.push(categorydata);
        });
        setCategories(categoryarr);
        setFilteredProduct(categoryarr)
        setSpinner(false);
      });
    };
    fetchAllCategories();
  }, []);

  const searchData = useSelector((state: any) => state.icon);

  useEffect(() => {
    if (searchData) {
      const filterData = categories.filter(data => data.category[locale].toLowerCase().includes(searchData.search))
      setFilteredProduct(filterData)
    }
  }, [searchData.search])

  useEffect(() => {
    if (searchData) {
      const filterData = categories.filter(data => data.category[locale].toLowerCase().includes(searchData.mobileSearch))
      setFilteredProduct(filterData)
    }
  }, [searchData.mobileSearch])

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
            <Heading size={{ base: "sm", md: "md" }} mb={5}>{t("Categorie.title")}</Heading>
            <Stack
              spacing={{ base: "6", md: "8", lg: "12" }}
              pb={{ base: "6", md: "8", lg: "12" }}
            >
              {
                filteredProduct.length != 0 ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    gap={{ base: "8", lg: "10" }}
                  >
                    {filteredProduct.map((data, index) => {
                      return <ProductCard key={index} product={data} />;
                    })}
                  </SimpleGrid>
                ) : (
                  <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
                    <Image src={blankImg} alt="blank img" width={400} height={400} />
                    <Text>{t("Categorie.NotFound")}</Text>
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

export default Categories;
