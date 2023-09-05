import { db } from '@/firebase/client'
import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { ImageWithOverlay } from './ImageWithOverlay'
import { useRouter } from 'next/router'

export const CardGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const { locale } = useRouter();

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
        // setIsLoading(false);
      });
    };
    fetchAllCategories();
  }, []);
  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: '4', md: '8', lg: '12' }}
      py={{ base: '6', md: '8', lg: '12' }}
    >
      <Stack spacing={{ base: '6', md: '8', lg: '12' }} display={"inline-block"}>
        <Stack
          height={{ md: "300px" }}
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "6", md: "10" }}
          align="stretch"
        >
          {categories.map((category, index) => {
            if (index < 4) {
              // return <CategoryCard key={category.name} category={category} />
              return <ImageWithOverlay
                flex="1"
                objectPosition="top center"
                title={category.category[locale]}
                src={category.image}
                alt="Lovely Image"
                categoryID={category.id}
                key={index}
              />
            }
          })}
        </Stack>
      </Stack>
    </Box>
  )
}