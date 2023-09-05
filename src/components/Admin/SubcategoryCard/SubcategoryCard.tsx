import React from "react";
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
import { CategoriesButtonGroup } from "../CategoriesCard/CategoriesButtonGroup";


function SubcategoryCard(props: any) {
  console.log("props", props);

  const handleClick = (value: any) => {
    props.modelOpen();
    props.handleData(value);
  };

  const handleDelete = (value: any) => {
    props.handleDelete(value);
  };

  return (
    <div>
      <Stack border={"3px solid rgba(0, 0, 0, 0.05)"} borderRadius={"4px"}>
        <Box position="relative" className="group">
          <AspectRatio ratio={3 / 4}>
            <Image
              src={props.subcategory.image}
              alt="image"
              draggable="false"
              width={150}
              unoptimized
              height={150}
            />
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
            handleClick={() => handleClick(props.subcategory)}
            handleDelete={() => handleDelete(props.subcategory)}
          />
          </Box>
        </Box>
        <Stack textAlign={"center"} py={{ base: "6", md: "8", lg: "6" }} m={0}>
          <Text>{props.subcategory.subcategory.en}</Text>
        </Stack>
      </Stack>
    </div>
  );
}

export default SubcategoryCard;
