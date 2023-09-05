import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, setDoc, query, where, onSnapshot, doc, orderBy, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

export const NewArrival = ({ heading }: { heading: string }) => {
  const [allproducts, setAllproducts] = useState<any[]>([]);
  const [UID, setUID] = useState("");
  const [userId, setUserId] = useState<string>();
  const [CartData, setCartData] = useState<any>({});
  const [wishData, setWishData] = useState<any>([]);
  const [cartColID, setCartColID] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setUID(localStorage.getItem("userId"))
    const fetchAllProducts = async () => {
      const productsQuery = collection(db, "storeProducts");
      const productsQueryRef = query(productsQuery, orderBy("createdAt", "desc"));
      await onSnapshot(productsQueryRef, (productsSnapshot) => {
        const productsArr: any[] = [];
        productsSnapshot.docs.map((products) => {
          const productsdata = products.data();
          productsArr.push({ ...productsdata, id: products.id });
        });
        setAllproducts(productsArr);
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

      setUserId(userSnapshot.docs[0]?.id)
      const docId = userSnapshot.docs[0]?.id
      if (docId) {
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

  return (
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
        <Flex
          justify="space-between"
          align={{ base: "center", md: "center" }}
          direction={{ base: "row", md: "row" }}
        >
          <Heading fontSize={"2rem"} mb={{ base: "3", md: "0" }}>
            {heading}
          </Heading>
          <HStack spacing={{ base: "2", md: "3" }}>
            <Button
              fontWeight="semibold"
              color={'#000'}
              variant="ghost"
              onClick={() => router.push("/allproducts")}
              fontSize={{ base: "lg", md: "lg" }}
            >
              {t('Home.AllProductSeeAll')}
            </Button>
          </HStack>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
          gap={{ base: "8", lg: "10" }}
        >
          {allproducts.map((product, index) => {
            let isWishList = wishData && wishData.includes(product.id)
            if (index < 3) {
              return <ProductCard
                key={index}
                product={product}
                wishData={wishData}
                isWishList={isWishList}
                wishList={addWishList}
              />
            }
          })}
        </SimpleGrid>
      </Stack>
    </Box >
  );
}