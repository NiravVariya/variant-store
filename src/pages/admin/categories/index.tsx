import CategoriesCard from "@/components/Admin/CategoriesCard/CategoriesCard";
import { db } from "@/firebase/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import Categoryform from "../../../components/Admin/Categoryform/Categoryform";
import { useRouter } from "next/router";
import Image from "next/image";
import blankImg from "@/assets/empty.svg";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchList, setSearchList] = useState<any>("");
  const [filteredcategories, setFilteredcategories] = useState([]);
  const router = useRouter();

  const handleEdit = (value: any) => {
    setEditId(value.id);
  };

  const handleDelete = async (value: any) => {
    if (value.id) {
      // delete category
      const deleteService = doc(db, "Categories", value.id);
      await deleteDoc(deleteService).then(() => {
        toast.success("data deleted successfully...");
      });
    }
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    const fetchAllService = async () => {
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
        setFilteredcategories(categoryarr);
        setIsLoading(false);
      });
    };
    fetchAllService();
  }, []);

  useEffect(() => {
    const filteredcategory: any = categories.filter((category) => {
      if (category.category.en.toLowerCase().includes(searchList)) {
        return category;
      }
    });
    setFilteredcategories(filteredcategory);
  }, [searchList]);

  return (
    <div>
      <Flex
        minWidth="max-content"
        alignItems={{ base: "", md: "center" }}
        gap="2"
        direction={{ base: "column", lg: "row" }}
      >
        <Box p="2">
          <Heading size="md">Categories List</Heading>
        </Box>
        <Spacer />
        <Flex gap="2" direction={{ base: "column", sm: "row" }}>
          <InputGroup maxW={{ base: "100%", md: "xs" }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Search by Categories"
              _focus={{ borderColor: "#242F51" }}
              value={searchList}
              onChange={(e) => {
                setSearchList(e.target.value);
              }}
            />
          </InputGroup>
          <ButtonGroup gap="2">
            <Button
              variant="primary"
              width={{ base: "100%", md: "auto" }}
              leftIcon={<AddIcon />}
              display={filteredcategories.length == 0 ? 'none': 'block'}
              onClick={() => {
                setEditId("");
                onOpen();
              }}
            >
              Add Categories
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>

      {isLoading ? (
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#00b2fe75"
            size="xl"
          />
        </Box>
      ) : (
        <>
          {filteredcategories.length == 0 ? (
            <Flex alignItems={"center"} justifyContent="center" mt={50} direction="column">
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
                Add Categories
              </Button>
            </Flex>
          ) : (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              gap={{ base: "8", lg: "10" }}
              py={{ base: "8", lg: "10" }}
            >
              {filteredcategories &&
                filteredcategories.map((data, index) => {
                  return (
                    <CategoriesCard
                      category={data}
                      key={index}
                      modelOpen={onOpen}
                      handleData={handleEdit}
                      handleDelete={handleDelete}
                    />
                  );
                })}
            </SimpleGrid>
          )}
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
            {editId ? "Edit Categories" : "Add New Categories"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Categoryform modelClose={onClose} editId={editId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WithAuth(Categories, USER_TYPE.Admin);
