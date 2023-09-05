import {
  AspectRatio,
  Box,
  HStack,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Rating } from "./Rating";
import { PriceTag } from "./PriceTag";
import { ProductButtonGroup } from "./ProductButtonGroup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";

interface Props {
  product: any;
}

export const ProductCard = (props: any) => {
  const { product, wishList, wishData, isWishList } = props;
  const router = useRouter();
  const { locale } = useRouter();
  const reduxData = useSelector((state: any) => state.icon);
  const currencyData = localStorage.getItem("currency");

  return (
    <Stack
      spacing="3"
      _hover={{
        outline: "3px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "4px",
      }}
    >
      <Box position="relative" className="group">
        <AspectRatio ratio={1} className="productCard" cursor={"pointer"}>
          <Image
            src={product.mainImage}
            alt={product.mainImage}
            width={100}
            height={100}
            draggable="false"
            // fallback={<Skeleton />}
            unoptimized
            // borderRadius={"4px"}
            onClick={() => router.push(`/productdetails/${product.id}`)}
          />
        </AspectRatio>
        <HStack spacing="3" position="absolute" top="4" left="4">
          {product.tags?.map((tag: any) => (
            <Tag
              key={tag.name}
              bg={`${tag.color}.500`}
              color="white"
              fontWeight="semibold"
            >
              {tag.name}
            </Tag>
          ))}
        </HStack>
        <Box
          opacity="0"
          transition="opacity 0.1s"
          _groupHover={{ opacity: 1 }}
          position="absolute"
          // bottom="3"
          // left="3"
          right="3"
          top="3"
          bg={useColorModeValue("white", "gray.800")}
          borderRadius="md"
          padding="1"
        >
          <ProductButtonGroup
            addWishList={() => wishList(product, product.id)}
            wishData={wishData}
            isWhishList={isWishList}
          />
        </Box>
      </Box>
      <Stack spacing="1" textAlign={"center"}>
        <Text letterSpacing={"0.04em"} fontSize={"lg"}>
          {product.ProductName && product.ProductName[locale]}
        </Text>
        <HStack justifyContent={"center"}>
          <Rating defaultValue={product.AvgRating} size="sm" />
        </HStack>
      </Stack>
      <PriceTag
        currency={reduxData.currency ? product.currency : "USD"}
        // currency={reduxData.currency == "USD" ? "USD" : reduxData.currency}
        price={product.ProductPrice[ !currencyData ? "USD" :  currencyData == "USD" ? "USD" : "AED"]}
        priceProps={{
          fontWeight: "bold",
          fontSize: "md",
          color: "#000",
          marginTop: "-10px",
        }}
      />
    </Stack>
  );
};
