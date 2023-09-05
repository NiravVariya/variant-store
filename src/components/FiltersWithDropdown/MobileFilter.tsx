import { db } from '@/firebase/client'
import { setCategorie, setCleardata, setSubCategorie } from '@/store'
import {
  Button,
  Flex,
  FormControl,
  GridItem,
  HStack,
  Icon,
  Select,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  PriceFilterPopover,
} from './Filter'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { MdFilterList } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { FilterDrawer } from './FilterDrawer'
import { SortbySelect } from './SortBySelect'
import useTranslation from '@/hooks/useTranslation'
import { useRouter } from 'next/router'

export const MobileFilter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [Categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categorieValue, setCategorieValue] = useState<any>('');
  const [subCategoryValue, setSubCategoryValue] = useState<any>('');
  const [sortSelectOption, setSortSelectOption] = useState<any>("");
  const [clearButton, setclearButton] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const categoryId: any = router.query.id;
  const subCategoryId: any = router.query.subCatId;

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
    setSortSelectOption(t("AllProducts.BestSeller"));
  }

  return (
    <>
      <Flex width="full" justify="space-between" display={{ base: 'flex', md: 'none' }}>
        <HStack
          as="button"
          fontSize="sm"
          type="button"
          px="3"
          py="1"
          onClick={onOpen}
          borderWidth="1px"
          rounded="md"
        >
          <Icon as={MdFilterList} />
          <Text>{t("AllProducts.FilterBy")}</Text>
        </HStack>
        <SortbySelect width="120px" defaultValue="23" placeholder={t("AllProducts.SortBy")} setSortSelectOption={setSortSelectOption} sortSelectOption={sortSelectOption} setclearButton={setclearButton} />
      </Flex>
      <FilterDrawer isOpen={isOpen} onClose={onClose}>
        <Stack spacing="6" divider={<StackDivider />}>
          <PriceFilterPopover setclearButton={setclearButton} />
          <GridItem>
            <FormControl>
              <Select
                size="lg"
                ms={0.5}
                fontSize={16}
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
                      <option value={value.id} key={index}
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
                size="lg"
                fontSize={16}
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
                    <option value={value.id} key={index}>
                      {value.subcategory[locale]}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </GridItem>
          {clearButton && <Button className="btn" color={"#fff"} onClick={handleClear}>Clear Filter</Button>}
          <Button className="btn" color={"#fff"} onClick={onClose}>{t("AllProducts.Close")}</Button>
        </Stack>
      </FilterDrawer>
    </>
  )
}
