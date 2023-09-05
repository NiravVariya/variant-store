import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  useDisclosure,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import SubcategoryCard from "@/components/Admin/SubcategoryCard/SubcategoryCard";
import Subcategoryform from "../../../components/Admin/Subcategoryform/Subcategoryform";
import { fetchSubCategory } from "@/components/functions/fetchSubCategory";
import { handleDelete } from "@/components/functions/handleSubCategoryDelete";
import blankImg from "@/assets/empty.svg";
import Image from "next/image";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";

function CategotyInfoId() {
  const router = useRouter();
  const { categotyInfoId } = router.query;
  const [subcategory, setSubcategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (value: any) => {
    setEditId(value.id);
  };

  useEffect(() => {
    if (categotyInfoId) {
      fetchSubCategory(categotyInfoId, (data: any) => {
        setSubcategory(data);
        setIsLoading(false);
      });
    }
  }, [categotyInfoId]);

  return (
    <div>
      <Flex
        minWidth="max-content"
        alignItems={{ base: "", md: "center" }}
        gap="2"
        direction={{ base: "column", lg: "row" }}
      >
        <Box p="2">
          <Heading size="md">Sub Categories List</Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap="2">
          <Button
            variant="primary"
            display={subcategory.length == 0 ? "none" : "block" }
            leftIcon={<AddIcon />}
            onClick={() => {
              setEditId("");
              onOpen();
            }}
          >
            Add Sub Category
          </Button>
        </ButtonGroup>
      </Flex>
      {isLoading ? (
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
      ) : subcategory.length != 0 ? (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            gap={{ base: "8", lg: "10" }}
            py={{ base: "8", lg: "10" }}
          >
            {subcategory &&
              subcategory.map((data, index) => {
                return (
                  <SubcategoryCard
                    subcategory={data}
                    key={index}
                    modelOpen={onOpen}
                    handleData={handleEdit}
                    handleDelete={() => handleDelete(data.id, categotyInfoId)}
                  />
                );
              })}
          </SimpleGrid>
        </>
      ) : (
        <>
          <Flex
            alignItems={"center"}
            justifyContent="center"
            mt={50}
            direction="column"
          >
            <Image src={blankImg} alt="blank img" width={500} height={500} />
            <Button
              variant="primary"
              width={{ base: "100%", md: "auto" }}
              leftIcon={<AddIcon />}
              onClick={() => {
                setEditId("");
                onOpen();
              }}
            >
              Add Sub Categories
            </Button>
          </Flex>
        </>
      )}

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? "Edit Subcategories" : "Add New Subcategories"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Subcategoryform
              modelClose={onClose}
              editId={editId}
              categotyId={categotyInfoId}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default WithAuth(CategotyInfoId, USER_TYPE.Admin);
