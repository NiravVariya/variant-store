import React, { useEffect, useState } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import { Box, Flex, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { ProductCard } from "@/components/NewArrival/ProductCard";
import { FiltersWithDropdown } from "@/components/FiltersWithDropdown/FiltersWithDropdown";
import { db } from "@/firebase/client";
import { collection, setDoc, query, where, onSnapshot, doc, updateDoc, orderBy, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAllProductData, setCart, setFilterProductData } from "@/store";
import blankImg from "@/assets/empty.svg";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";

const Allproducts = () => {
  const [allproducts, setAllproducts] = useState<any>([]);
  const [userId, setUserId] = useState<string>();
  const [CartData, setCartData] = useState<any>({});
  const [spinner, setSpinner] = useState(true);
  const [cartColID, setCartColID] = useState('');
  const [wishData, setWishData] = useState<any>([]);
  const [UID, setUID] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxData = useSelector((state: any) => state.icon);
  const currencyData = reduxData.currency == "USD" ? "USD" : "AED"
  const categoryId: any = router.query.id;
  const subCategoryId = router.query.subCatId;
  const { t } = useTranslation();
  const { locale } = useRouter();

  useEffect(() => {
    setUID(localStorage.getItem("userId"))
    const fetchAllProducts = async () => {
      const productsQuery = collection(db, "storeProducts");
      const productsQueryRef = query(productsQuery, orderBy("createdAt", "desc"));
      await onSnapshot(productsQueryRef, (productsSnapshot) => {
        const productsArr: any = [];
        productsSnapshot.docs.map(async (products) => {
          const productsdata = products.data();
          productsArr.push({ ...productsdata, id: products.id });
        });
        dispatch(setAllProductData(productsArr));
        dispatch(setFilterProductData(productsArr));
        setAllproducts(productsArr);
        setSpinner(false);
      });
    };
    fetchAllProducts();
  }, []);


  const fetchCartData = async () => {
    const SupplierQuery = query(
      collection(db, "storeUsers"),
      where("id", "==", UID)

    );
    await onSnapshot(SupplierQuery, (userSnapshot: any) => {
      const docId = userSnapshot.docs[0]?.id
      if (docId) {
        setUserId(userSnapshot.docs[0].id)
        const newdocRef = collection(db, "storeUsers", docId, "cart");
        onSnapshot(newdocRef, (querydata) => {
          let newArray: any = [];
          querydata.docs.map((item) => {
            newArray.push({ ...item.data(), id: item.id })
            setCartData({ ...item.data(), id: item.id })
            setCartColID(item.id)
          })
        });
      }
    })
  }

  useEffect(() => {
    if (UID) {
      fetchCartData();
    }
  }, [UID])

  const fetchWishListData = async () => {
    const SupplierQuery = query(
      collection(db, "storeUsers"),
      where("id", "==", UID)
    );
    await onSnapshot(SupplierQuery, (userSnapshot: any) => {
      const docId = userSnapshot.docs[0]?.id
      if (docId) {
        const newdocRef = collection(db, "storeUsers", docId, "wishlist");
        onSnapshot(newdocRef, (querydata) => {
          let newArray: any = [];
          querydata.docs.map((item) => {
            newArray.push(item.id)
          })
          setWishData(newArray)
        });
      }
    })
  }

  useEffect(() => {
    if (UID) {
      fetchWishListData();
    }
  }, [UID])

  const addWishList = async (value: any) => {
    let { id } = value

    if (UID) {
      const SupplierQuery = query(
        collection(db, "storeUsers"),
        where("id", "==", UID)
      );
      onSnapshot(SupplierQuery, async (userSnapshot) => {
        const idRef = userSnapshot.docs[0].id
        const newRef = doc(db, "storeUsers", idRef, "wishlist", id);
        const newArray = [];
        const data = { ...value }
        newArray.push(data);
        let isWishList = wishData && wishData.includes(id)
        if (isWishList) {
          const deleteService = doc(
            db,
            "storeUsers",
            userId,
            "wishlist",
            id
          );
          deleteDoc(deleteService).then(() => {
            toast.success(t("Wishlist.RemoveToastMsg"));
          });
        } else {
          setDoc(newRef, {
            ...data
          }).then(() => {
            toast.success(t("NewArrival.AddWishListToastMsg"))
          })
        }
      })
    } else {
      toast.error(t("NewArrival.LoginMsg"));
      router.push("/login")
    }
  }

  useEffect(() => {
    const minPrice = reduxData.range[0];
    const maxPrice = reduxData.range[1];
    const filteredItems: any = allproducts.filter((item: any) => {
      return item.ProductPrice[currencyData] >= minPrice && item.ProductPrice[currencyData] <= maxPrice;
    });
    dispatch(setFilterProductData(filteredItems));
  }, [reduxData.range])

  useEffect(() => {
    if (reduxData.sortValue == "best-seller") {
      const productsQuery = collection(db, "storeProducts");
      const productsQueryRef = query(
        productsQuery,
        orderBy("createdAt", "desc")
      );
      onSnapshot(productsQueryRef, (productsSnapshot) => {
        const productsArr: any = [];
        productsSnapshot.docs.map(async (products) => {
          const productsdata = products.data();
          if (products.data().mostSelling) {
            productsArr.push({ ...productsdata, id: products.id });
          }
        });
        dispatch(setFilterProductData(productsArr));
      });
    } else if (reduxData.sortValue == "Trending") {
      const productsQuery = collection(db, "storeProducts");
      const productsQueryRef = query(
        productsQuery,
        orderBy("createdAt", "desc")
      );
      onSnapshot(productsQueryRef, (productsSnapshot) => {
        const productsArr: any = [];
        productsSnapshot.docs.map(async (products) => {
          const productsdata = products.data();
          if (products.data().isTrending) {
            productsArr.push({ ...productsdata, id: products.id });
          }
        });
        dispatch(setFilterProductData(productsArr));
      });
    } else if (reduxData.sortValue == "high-to-low") {
      const supplierSub = query(
        collection(db, "storeProducts"),
        orderBy("ProductPrice", "desc")
      );
      onSnapshot(supplierSub, (querySnapshot) => {
        const data: any = querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
        dispatch(setFilterProductData(data));
      });
    } else if (reduxData.sortValue == "low-to-high") {
      const supplierSub = query(
        collection(db, "storeProducts"),
        orderBy("ProductPrice", "asc")
      );
      onSnapshot(supplierSub, (querySnapshot) => {
        const data: any = querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
        dispatch(setFilterProductData(data));
      });
    } else {
      dispatch(setFilterProductData(allproducts));
    }
  }, [reduxData.sortValue])


  useEffect(() => {
    if (categoryId) {
      const filterCatData: any = allproducts.filter((data: any) => data.categorieId.includes(categoryId));
      dispatch(setFilterProductData(filterCatData));
      router.replace("/allproducts");
    }
    if (subCategoryId) {
      const filterSubCatData: any = allproducts.filter((data: any) =>
        data.subCategorieId.includes(subCategoryId)
      );
      dispatch(setFilterProductData(filterSubCatData));
      router.replace("/allproducts");
    }
  }, [categoryId, subCategoryId, allproducts])

  useEffect(() => {
    if (reduxData) {
      const filterCatData: any = allproducts.filter((data: any) => data.categorieId.includes(reduxData.categorie));
      dispatch(setFilterProductData(filterCatData));
    }
  }, [reduxData.categorie])

  useEffect(() => {
    if (reduxData) {
      const filterSubCatData: any = allproducts.filter((data: any) => data.subCategorieId.includes(reduxData.subCategorie));
      dispatch(setFilterProductData(filterSubCatData));
    }
  }, [reduxData.subCategorie])

  useEffect(() => {
    if (reduxData) {
      const filterData: any = allproducts.filter((data: any) => data.ProductName[locale].toLowerCase().includes(reduxData.search));
      dispatch(setFilterProductData(filterData));
    }
  }, [reduxData.search])

  useEffect(() => {
    if (reduxData) {
      const filterData: any = allproducts.filter((data: any) => data.ProductName[locale].toLowerCase().includes(reduxData.mobileSearch));
      dispatch(setFilterProductData(filterData));
    }
  }, [reduxData.mobileSearch])

  return (
    <div>
      <App />
      <FiltersWithDropdown heading={t("AllProducts.AllProducts")} />
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
            <Stack
              spacing={{ base: "6", md: "8", lg: "12" }}
              pb={{ base: "6", md: "8", lg: "12" }}
            >
              {
                reduxData.filterProductData.length != 0 ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 4, lg: 4 }}
                    gap={{ base: "8", lg: "10" }}
                  >
                    {reduxData && reduxData.filterProductData.map((product: any, index: number) => {
                      let isWishList = wishData && wishData.includes(product.id)
                      return <ProductCard key={index} product={product} isWishList={isWishList} wishList={addWishList} />;
                    })}
                  </SimpleGrid>
                ) : (
                  <Flex flexDirection={"column"} alignItems={"center"}>
                    <Image src={blankImg} alt="blank img" width={400} height={400} />
                    <Text fontSize={"lg"}>{t("ShoppingCart.ProductNotFound")}</Text>
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

export default Allproducts;
