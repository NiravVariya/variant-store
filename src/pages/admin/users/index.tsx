import React, { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Avatar,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  FormControl,
  FormLabel,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/router";
import { AddIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";
import * as Yup from "yup";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Dropzone from "@/components/Common/Dropzone";
import useImage from "@/hooks/useImage";
import firebaseConfig from "../../../firebase/firebaseConfig.json";
import { toast } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Image from "next/image";
import userBlankImg from "@/assets/User Empty.svg"

function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [openIcon, setOpenIcon] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchList, setSearchList] = useState<any>("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paginateItems, setPaginateItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const router = useRouter();
  const [fileInputRef, imageUrl, _, handleFileUpload] = useImage();

  const schema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    image: Yup.string().required("Please Upload Your Image").label("Image").default(""),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(6).label("Password"),
  });

  type Inputs = {
    name: string;
    email: string;
    password: string;
    image: string
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues
  } = useForm<Inputs>({
    resolver: yupResolver<any>(schema),
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    const UserQuery = collection(db, "storeUsers");
    await onSnapshot(UserQuery, (userSnapshot) => {
      let newArray: any = [];
      userSnapshot.docs.map((item) => {
        newArray.push({ ...item.data(), id: item.id });
      });
      setUsers(newArray);
      setFilteredUsers(newArray);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredOrder: any = users.filter((order) => {
      if (order.name?.toLowerCase().includes(searchList)) {
        return order;
      }
    });
    setFilteredUsers(filteredOrder);
    setItemOffset(0);
  }, [searchList]);

  useEffect(() => {
    const endOffset = itemOffset + 5;
    setPaginateItems(filteredUsers.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredUsers.length / 5));
  }, [filteredUsers, itemOffset]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 5) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  const firebaseData = {
    "projectId": firebaseConfig.projectId,
    "firebaseConfig": firebaseConfig,
    "storeId": firebaseConfig.storeId,
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let dataArray = { ...data, ...firebaseData }
    _('');
    try {
      var config = {
        method: 'post',
        url: 'https://vindyy.com/api/create-user',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dataArray
      };

      axios(config)
        .then(function (response) {
          response.data?.data?.msg?.error?.message ?
            toast.error(response.data.data.msg.error.message) :
            toast.success("User Added Successfully")
          reset({
            name: "",
            email: "",
            password: "",
            image: ""
          });
        })
        .catch(function (error) {
          console.log("error=========>", error);
        });

    } catch (error) {
      console.log("err=============>", error);
    }
    onClose();
  }

  return (
    <>
      <Flex justifyContent={"flex-end"} mb={5}>
        <InputGroup maxW="xs">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="muted" boxSize="5" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            _focus={{ borderColor: "#242F51" }}
            value={searchList}
            onChange={(e) => {
              setSearchList(e.target.value);
            }}
          />
        </InputGroup>
      </Flex>
      <Flex justifyContent={"flex-end"} mb={5}>
        <Button
          variant="primary"
          leftIcon={<AddIcon />}
          onClick={() => {
            onOpen();
          }}
        >
          Add User
        </Button>
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
      ) : users.length != 0 ? (
        <TableContainer mb={10}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th align="center">Profile</Th>
                <Th align="left">Name</Th>
                <Th align="left">Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginateItems &&
                paginateItems.map((item, index) => {
                  return (
                    <Tr key={index} style={{ marginBottom: "20px" }}>
                      <Td>{itemOffset + (index + 1)}</Td>
                      <Td align="center">
                        <Avatar size="lg" src={item?.image} />
                      </Td>
                      <Td>{item.name}</Td>
                      <Td>{item.email.toLowerCase()}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer >
      ) : (
        <Flex flexDirection={"column"} alignItems={"center"} gap={6}>
          <Image src={userBlankImg} alt="blank img" width={200} height={200} />
          <Stack>
            <Text fontSize="2xl" fontWeight={"bold"} textAlign="center">
              Your users will show here
            </Text>
            <Text px={"20%"} textAlign={"center"}>The user page currently has no users to display.</Text>
          </Stack>
        </Flex>
      )
      }
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent={"center"}>
              <Text>Add New User</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="6" mb={5}>
              <form
                onSubmit={handleSubmit(onSubmit)}
              >
                <Stack spacing="4">
                  <FormControl id="picture">
                    <FormLabel variant="inline">Photo</FormLabel>
                    <Dropzone
                      path={``}
                      fileInputRef={fileInputRef}
                      onUpload={(res) => {
                        handleFileUpload(res);
                        setValue("image", res)
                      }}
                      uploadedImage={getValues("image") || ""}
                    />
                    <p style={{ marginTop: 0, color: "#ff0000" }}>
                      {errors.image?.message}
                    </p>
                  </FormControl>
                  <Input
                    placeholder="Enter name"
                    name="name"
                    autoComplete="name"
                    {...register("name")}
                  />
                  <p style={{ marginTop: 0, color: "#ff0000" }}>
                    {errors.name?.message}
                  </p>
                  <Input
                    placeholder="Enter email"
                    name="email"
                    autoComplete="email"
                    {...register("email")}
                  />
                  <p style={{ marginTop: 0, color: "#ff0000" }}>
                    {errors.email?.message}
                  </p>
                  <FormControl>
                    <InputGroup>
                      <InputRightElement>
                        {
                          openIcon ? (
                            <IconButton
                              aria-label={""}
                              icon={<HiEyeOff />}
                              onClick={() => setOpenIcon(false)}
                            />
                          ) : (
                            <IconButton
                              aria-label={""}
                              icon={<HiEye />}
                              onClick={() => setOpenIcon(true)}
                            />
                          )
                        }
                      </InputRightElement>
                      <Input
                        placeholder="Enter password"
                        name="password"
                        type={openIcon ? "password" : "text"}
                        autoComplete="current-password"
                        {...register("password")}
                      />
                    </InputGroup>
                  </FormControl>
                  <p style={{ marginTop: 0, color: "#ff0000" }}>
                    {errors.password?.message}
                  </p>
                  <Button
                    variant="primary"
                    type="submit"
                    loadingText="Sign in"
                  >
                    Add User
                  </Button>
                </Stack>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WithAuth(Users, USER_TYPE.Admin);

