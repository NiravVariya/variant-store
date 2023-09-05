import {
  Box,
  Button,
  Flex,
  FormControl,
  GridItem,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { ProductBreadcrumb } from './ProductBreadcrumb'
import { SortbySelect } from './SortBySelect'
import {
  PriceFilterPopover,
} from './Filter'
import { MobileFilter } from './MobileFilter'
import { breadcrumbData } from './_data'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/client'
import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { setCategorie, setSubCategorie, setCleardata } from '@/store'
import { useRouter } from 'next/router'
import useTranslation from '@/hooks/useTranslation'

export const FiltersWithDropdown = ({ heading }: { heading: string }) => {
  const [Categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categorieValue, setCategorieValue] = useState<any>('');
  const [subCategoryValue, setSubCategoryValue] = useState<any>('');
  const [sortSelectOption, setSortSelectOption] = useState<any>("");
  const [clearButton, setclearButton] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const categoryId: any = router.query.id;
  const subCategoryId: any = router.query.subCatId;
  const { t } = useTranslation();
  const { locale } = useRouter();

  useEffect(() => {
    if (categoryId) {
      fetchSubcategory(categoryId);
      setCategorieValue(categoryId)
    }
    if (subCategoryId) {
      setSubCategoryValue(subCategoryId)
    }
  }, [categoryId, subCategoryId])

  useEffect(() => {
    fetchAllCategories();
  }, [])

  const fetchAllCategories = async () => {
    const categoryQuery = collection(db, "Categories");
    await onSnapshot(categoryQuery, (categorySnapshot) => {
      const categoryarr: any = [];
      categorySnapshot.docs.map((category) => {
        categoryarr.push({ ...category.data(), id: category.id });
      });
      setCategories(categoryarr);
    });
  };

  const fetchSubcategory = (item: any) => {
    const refquery = collection(db, "Categories", item, "Subcategory");
    onSnapshot(refquery, (querydata) => {
      setSubCategory(
        querydata.docs.map((docvalue) => ({
          ...docvalue.data(),
          id: docvalue.id,
        }))
      );
    });
  };

  const handleClear = () => {
    setclearButton(false);
    dispatch(setCleardata(""));
    setCategorieValue("");
    setSubCategoryValue(t("AllProducts.SubCategory"));
    setSubCategory([]);
    setSortSelectOption("");
  }

  return (
    <Box
      maxW="7xl"
      mx="auto"
      px={{ base: '4', md: '8', lg: '12' }}
      py={{ base: '6', md: '8', lg: '12' }}
    >
      <ProductBreadcrumb data={breadcrumbData} />
      <Heading fontSize={"1.9rem"} mt={{ base: '6', md: '6' }} mb="8" fontWeight={"normal"}>
        {heading}
      </Heading>
      <Flex justify="space-between" align="center" display={{ base: 'none', md: 'flex' }}>
        <HStack spacing="6">
          <Text color={mode('gray.600', 'gray.400')} fontWeight="medium" fontSize="sm">
            {t("AllProducts.FilterBy")}
          </Text>
          <SimpleGrid display="inline-grid" spacing="4" columns={4}>
            <PriceFilterPopover setclearButton={setclearButton} />
            <GridItem>
              <FormControl>
                <Select
                  cursor={"pointer"}
                  size="lg"
                  ms={0.5}
                  fontSize={15.5}
                  value={categorieValue}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    setCategorieValue(val)
                    fetchSubcategory(val);
                    dispatch(setCategorie(val));
                    setclearButton(true);
                  }}
                >
                  <option selected disabled value="">
                    {t("AllProducts.Category")}
                  </option>
                  {Categories &&
                    Categories.map((value, index) => {
                      return (
                        <option
                          value={value.id}
                          key={index}
                        >
                          {value.category[locale]}
                        </option>
                      )
                    })}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <Select
                  cursor={"pointer"}
                  size="lg"
                  fontSize={15.5}
                  value={subCategoryValue}
                  onChange={(e) => {
                    const val: any = e.target.value;
                    setSubCategoryValue(e.target.value);
                    dispatch(setSubCategorie(val));
                    setclearButton(true);
                  }}
                >
                  <option selected disabled value={t("AllProducts.SubCategory")}>
                    {t("AllProducts.SubCategory")}
                  </option>
                  {subCategory &&
                    subCategory.map((value, index) => (
                      <option
                        value={value.id}
                        key={index}
                      >
                        {value.subcategory[locale]}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </GridItem>
            {clearButton &&
              <Button
                variant={"ghost"}
                className="btn"
                fontWeight={"medium"}
                onClick={handleClear}
                width={100}
                color={"#fff"}
                height={47}
              >
                {t("AllProducts.ClearFilter")}
              </Button>
            }
          </SimpleGrid>
        </HStack>

        <HStack flexShrink={0}>
          <Text
            as="label"
            htmlFor="sort-by"
            color={mode('gray.600', 'gray.400')}
            fontWeight="medium"
            fontSize="sm"
            whiteSpace="nowrap"
          >
            {t("AllProducts.SortBy")}
          </Text>
          <SortbySelect
            setSortSelectOption={setSortSelectOption}
            sortSelectOption={sortSelectOption}
            setclearButton={setclearButton}
          />
        </HStack>
      </Flex>
      <MobileFilter />
    </Box>
  )
}
