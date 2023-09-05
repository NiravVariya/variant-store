import { db } from "@/firebase/client";
import { Box, Stack } from "@chakra-ui/react";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImageWithOverlay } from "./ImageWithOverlay";

export const HomeCategories = () => {
  const [subcategory, setSubcategory] = useState([]);
  const { locale } = useRouter();

  const fetchSubCategory = () => {
    const productsQuery = collection(db, "Categories");
    onSnapshot(productsQuery, (productsSnapshot) => {
      const newArray: any = []
      productsSnapshot.docs.map((res: any) => {
        const subCatQuery = collection(db, "Categories", res.id, "Subcategory");
        onSnapshot(subCatQuery, (subCat) => {
          subCat.docs.map((subCatQ) => {
            newArray.push({ ...subCatQ.data(), subCatId: subCatQ.id, catId: res.id })
          })
        })
        setTimeout(() => {
          setSubcategory(newArray);
        }, 1000);
      })
    })
  }

  useEffect(() => {
    fetchSubCategory();
  }, []);

  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "6", md: "10" }}
        align="stretch"
      >
        <>
          {subcategory.map((currentData: any, index: number) => {
            if (index <= 3) {
              return (
                  <ImageWithOverlay
                    key={index}
                    flex="1"
                    objectPosition="top center"
                    currentData={currentData}
                    title={currentData.subcategory[locale]}
                    src={currentData.image}
                    alt="Image"
                  />
              );
            }
          })}
        </>
      </Stack>
    </Box>
  );
};
