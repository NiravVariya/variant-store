import {
  AspectRatio,
  Box,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CategoriesButtonGroup } from "./CategoriesButtonGroup";

const CategoriesCard = (props: any) => {

  const handleClick = (value: any) => {
    props.modelOpen();
    props.handleData(value);
  };

  const handleDelete = (value: any) => {
    props.handleDelete(value);
  };
  return (
    <Stack border={"3px solid rgba(0, 0, 0, 0.05)"} borderRadius={"4px"}>
      <Box position="relative" className="group">
        <AspectRatio ratio={1}>
          <Link
            href={{ pathname: `/admin/subcategories/${props.category.id}` }}
          >
            <Image
              src={props.category.image}
              alt={props.category.category.en}
              draggable="false"
              width={300}
              height={150}
              unoptimized
              style={{width: 'auto'}}
            />
          </Link>
        </AspectRatio>
        <Box
          opacity="0"
          transition="opacity 0.1s"
          _groupHover={{ opacity: 1 }}
          position="absolute"
          bottom="3"
          left="3"
          right="3"
          bg={useColorModeValue("white", "gray.800")}
          borderRadius="md"
          padding="1.5"
        >
          <CategoriesButtonGroup
            handleClick={() => handleClick(props.category)}
            handleDelete={() => handleDelete(props.category)}
          />
        </Box>
      </Box>
      <Stack textAlign={"center"} py={{ base: "6", md: "8", lg: "6" }} m={0}>
        <Text>{props.category.category.en}</Text>
      </Stack>
    </Stack>
  );
};

export default CategoriesCard;
