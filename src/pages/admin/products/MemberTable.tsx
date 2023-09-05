import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Button,
  Tooltip,
  Divider,
  Spinner,
  Stack,
  Heading,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { IoArrowDown } from 'react-icons/io5'
import Rating from './Rating'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/client'
import { toast } from 'react-hot-toast'
import { BsArrowUpRightCircle, BsArrowUpRightCircleFill } from 'react-icons/bs'
import { MdDelete, MdReviews, MdStar, MdStarBorder } from 'react-icons/md'
import Image from 'next/image';
import blankImg from "@/assets/empty.svg";

function MemberTable(props: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [storeDocId, setStoreDocId] = useState("")
  const [ProductReviews, setProductReviews] = useState<any[]>([]);
  const [deleteProductId, setDeleteProductId] = useState("")
  const [secondCurrency, setSecondCurrency] = useState("")
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isSecondModalOpen,
    onOpen: onSecondModalOpen,
    onClose: onSecondModalClose,
  } = useDisclosure();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [DeleteID, setDeleteID] = useState("");

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap) => {
    settingSnap.docs.map((value) => {
      const dataref = doc(db, "storeSetting", value.id);
      setStoreDocId(dataref.id);
    });
  });

  useEffect(() => {
    if (storeDocId) {
      const newdocRef = collection(db, "storeSetting", storeDocId, "Currencies");
      onSnapshot(newdocRef, (querydata) => {
        setSecondCurrency(querydata.docs[0]?.data().mainCurrency)
      });
    }
  }, [storeDocId])

  const handleEditProduct = (value: any) => {
    router.push(`/admin/products/${value.id}`);
  };

  const handleDeleteProduct = async (value: any) => {
    if (value) {
      const deleteService = doc(db, "storeProducts", value);
      await deleteDoc(deleteService).then(() => {
        toast.success("data deleted successfully...");
      });
    }
  };

  const handleReview = (value: any) => {
    onSecondModalOpen();
    setIsLoading(true);
    const reviewQuery = collection(db, "storeProducts", value.id, "reviews");
    const reviewQueryRef = query(reviewQuery, orderBy("createdAt", "desc"));
    onSnapshot(reviewQueryRef, (querydata) => {
      let newArray: any = [];
      querydata.docs.map(async (docvalue) => {
        newArray.push({
          ...docvalue.data(),
          id: docvalue.id,
        });
      });
      setProductReviews(() => {
        setIsLoading(false);
        return newArray;
      });
      return;
    });
  };

  const handleDeleteReview = async (value: any) => {
    setIsDeleteLoading(true);
    if (value.id) {
      setDeleteID(value.id);
      const deleteService = doc(
        db,
        "storeProducts",
        value.productId,
        "reviews",
        value.id
      );
      await deleteDoc(deleteService).then(() => {
        setIsDeleteLoading(false);
        toast.success("Review deleted...");
      });
    }
  };

  const handleMostSelling = async (data: any) => {
    const updateRef = doc(db, "storeProducts", data.id);
    console.log("updateRef", updateRef);
    await updateDoc(updateRef, {
      ...data,
      mostSelling: data && data.mostSelling ? false : true,
      updatedAt: serverTimestamp(),
    }).then(() => {
      toast.success(
        `${data && data.mostSelling
          ? "Remove product from most selling"
          : "Add Product for Most selling."
        }`
      );
    });
  };

  const handleTrending = async (data: any) => {
    const updateRef = doc(db, "storeProducts", data.id);
    console.log("updateRef", updateRef);
    await updateDoc(updateRef, {
      ...data,
      isTrending: data && data.isTrending ? false : true,
      updatedAt: serverTimestamp(),
    }).then(() => {
      toast.success(
        `${data && data.isTrending
          ? "Remove product from Trending."
          : "Add Product for Trending."
        }`
      );
    });
  };

  return (<>
    <Table {...props}>
      <Thead>
        <Tr>
          <Th>
            <HStack spacing="3">
              {/* <Checkbox /> */}
              <HStack spacing="1">
                <Text>Name</Text>
                <Icon as={IoArrowDown} color="muted" boxSize="4" />
              </HStack>
            </HStack>
          </Th>
          <Th>Price in USD</Th>
          <Th>Price in {secondCurrency ? secondCurrency : "AED"}</Th>
          <Th>Rating</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.filteredProduct.map((data: any) => {
          return (
            <Tr key={data.id}>
              <Td>
                <HStack spacing="3">
                  {/* <Checkbox /> */}
                  <Avatar name={data.name} src={data?.ProductImage[0]} boxSize="10" />
                  <Box>
                    <Text fontWeight="medium">{data.ProductName.en}</Text>
                    {/* <Text color="muted">{data.Description.en}</Text> */}
                  </Box>
                </HStack>
              </Td>
              <Td>
                <Text color="muted">{data.ProductPrice.USD}</Text>
              </Td>
              <Td>
                <Text color="muted">{data.ProductPrice.AED}</Text>
              </Td>
              <Td>
                <Text color="muted">
                  <Rating defaultValue={data.AvgRating} size="xl" />
                </Text>
              </Td>
              <Td>
                <HStack spacing="1">
                  <Tooltip hasArrow label="Delete" bg="#319795">
                    <IconButton
                      icon={<FiTrash2 fontSize="1.25rem" />}
                      variant="ghost"
                      aria-label="Delete data"
                      onClick={() => {
                        onOpen()
                        setDeleteProductId(data.id)
                      }}
                    />
                  </Tooltip>
                  <Tooltip hasArrow label="Edit" bg="#319795">
                    <IconButton
                      icon={<FiEdit2 fontSize="1.25rem" />}
                      variant="ghost"
                      aria-label="Edit data"
                      onClick={() => handleEditProduct(data)}
                    />
                  </Tooltip>
                  <Tooltip hasArrow label="Reviews" bg="#319795">
                    <IconButton
                      icon={<MdReviews fontSize="1.25rem" />}
                      variant="ghost"
                      aria-label="Review data"
                      onClick={() => handleReview(data)}
                    />
                  </Tooltip>
                  <Tooltip hasArrow label="Most-Selling" bg="#319795">
                    <IconButton
                      icon={data.mostSelling == true ? <MdStar fontSize="1.25rem" /> : < MdStarBorder fontSize="1.25rem" />}
                      variant="ghost"
                      aria-label="Most-Selling data"
                      onClick={() => handleMostSelling(data)}
                    />
                  </Tooltip>
                  <Tooltip hasArrow label="Trending" bg="#319795">
                    <IconButton
                      icon={data.isTrending == true ? <BsArrowUpRightCircleFill fontSize="1.25rem" /> : <BsArrowUpRightCircle fontSize="1.25rem" />}
                      variant="ghost"
                      aria-label="Trending data"
                      onClick={() => handleTrending(data)}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={"normal"} fontSize={"md"}>Are you sure you want to delete this product?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter justifyContent={"center"}>
            <Flex gap={4} mb={4}>
              <Button onClick={() => {
                handleDeleteProduct(deleteProductId);
                onClose();
              }}
              >
                Confirm
              </Button>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isCentered
        onClose={onSecondModalClose}
        isOpen={isSecondModalOpen}
        scrollBehavior={"inside"}
        motionPreset="slideInBottom"
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Reviews</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {ProductReviews.length !== 0 ? (
                  <>
                    {ProductReviews &&
                      ProductReviews.map((data: any, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Flex justifyContent={"space-between"}>
                              <Stack>
                                <Heading size={"xs"} fontWeight="medium">
                                  {data.userName}
                                </Heading>
                                <Heading size={"sm"} fontWeight="medium">
                                  {data.title}
                                </Heading>
                                <Text>{data.comment}</Text>
                                <Rating
                                  defaultValue={data.startValue}
                                  size="sm"
                                />
                              </Stack>
                              <IconButton
                                aria-label="Delete Review Button"
                                isLoading={
                                  DeleteID === data.id ? isDeleteLoading : null
                                }
                                variant="primary"
                                fontSize="18px"
                                icon={<MdDelete />}
                                onClick={() => handleDeleteReview(data)}
                              />
                            </Flex>
                            <Divider my={5} />
                          </React.Fragment>
                        );
                      })}
                  </>
                ) : (
                  <Flex
                    alignItems={"center"}
                    justifyContent="center"
                    mt={50}
                    direction="column"
                  >
                    <Image
                      src={blankImg}
                      alt="blank img"
                      width={500}
                      height={500}
                    />
                  </Flex>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  </>)
}

export default MemberTable;
