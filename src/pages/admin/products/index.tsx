import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import MemberTable from './MemberTable'
import Link from 'next/link'
import { AddIcon } from '@chakra-ui/icons'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function Products() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchList, setSearchList] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const productQuery = collection(db, "storeProducts");
    const productQueryRef = query(productQuery, orderBy("createdAt", "desc"));
    await onSnapshot(productQueryRef, (productSnapshot) => {
      const productArr: any[] = [];
      productSnapshot.docs.map((value) => {
        productArr.push({ ...value.data(), id: value.id });
      });
      setProducts(productArr);
      setFilteredProduct(productArr);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const filteredProducts: any = products.filter((product) => {
      if (product.ProductName.en.toLowerCase().includes(searchList)) {
        return product;
      }
    });
    setFilteredProduct(filteredProducts);
  }, [searchList]);

  return (
    <Container py={{ base: '4', md: '8' }} px={{ base: '0', md: 8 }}>
      <Flex mb={4} justifyContent={"flex-end"}>
        <Button
          as={Link}
          href={"/admin/products/addproduct"}
          variant="primary"
          leftIcon={<AddIcon />}
          width={{ base: "100%", md: "auto" }}
        >
          Add Product
        </Button>
      </Flex>
      {isLoading ? (<>
        <Flex
          minWidth="max-content"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#00b2fe75"
            size="xl"
            alignSelf="center"
            justifyContent="center"
            alignItems="center"
          />
        </Flex>
      </>) : (<>
        <Box
          bg="bg-surface"
          boxShadow={{ base: 'none', md: 'sm' }}
          borderRadius={{ base: 'none', md: 'lg' }}
        >
          <Stack spacing="5">
            <Box px={{ base: '4', md: '6' }} pt="5">
              <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
                <Text fontSize="lg" fontWeight="medium">
                  Products
                </Text>
                <InputGroup maxW="xs">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="muted" boxSize="5" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search"
                    value={searchList}
                    onChange={(e) => {
                      setSearchList(e.target.value);
                    }}
                  />
                </InputGroup>
              </Stack>
            </Box>
            <Box overflowX="auto">
              <MemberTable filteredProduct={filteredProduct} />
            </Box>
            {/* <Box px={{ base: '4', md: '6' }} pb="5">
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  Showing 1 to 5 of 42 results
                </Text>
              )}
              <ButtonGroup
                spacing="3"
                justifyContent="space-between"
                width={{ base: 'full', md: 'auto' }}
                variant="secondary"
              >
                <Button>Previous</Button>
                <Button>Next</Button>
              </ButtonGroup>
            </HStack>
          </Box> */}
          </Stack>
        </Box>
      </>
      )}
    </Container>
  )
}

export default Products;
