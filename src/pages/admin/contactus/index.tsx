import { db } from "@/firebase/client";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Input, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { collection, onSnapshot } from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";
import Image from "next/image";
import categoryBlankImg from "@/assets/Contact Us Empty.svg"

function ContactUs() {
  const [usersContact, setUsersContact] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchList, setSearchList] = useState<any>("");
  const [filteredContact, setFilteredContact] = useState([]);
  const [paginateItems, setPaginateItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const router = useRouter();

  const fetchProducts = async () => {
    setIsLoading(true);
    const UserQuery = collection(db, "ContactUS");
    await onSnapshot(UserQuery, (userSnapshot) => {
      let newArray: any = [];
      userSnapshot.docs.map((item) => {
        newArray.push({ ...item.data(), id: item.id });
      });
      setUsersContact(newArray);
      setFilteredContact(newArray);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredContact: any = usersContact.filter((contact) => {
      if (
        contact.name.toLowerCase().includes(searchList) ||
        contact.email.toLowerCase().includes(searchList)
      ) {
        return contact;
      }
    });
    setFilteredContact(filteredContact);
    setItemOffset(0);
  }, [searchList]);

  useEffect(() => {
    const endOffset = itemOffset + 5;
    setPaginateItems(filteredContact.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredContact.length / 5));
  }, [filteredContact, itemOffset]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 5) % filteredContact.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      <Flex justifyContent={"flex-end"} mb={10}>
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
      ) : usersContact.length != 0 ? (
        <TableContainer mb={10}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th align="center">Id</Th>
                <Th align="left">Name</Th>
                <Th align="left">Email</Th>
                <Th align="left">Comment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginateItems &&
                paginateItems.map((item, index) => {
                  return (
                    <Tr key={index} style={{ marginBottom: "20px" }}>
                      <Td align="center">{itemOffset + (index + 1)}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.email}</Td>
                      <Td>{item.comments}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Flex flexDirection={"column"} alignItems={"center"} gap={4}>
          <Image src={categoryBlankImg} alt="blank img" width={300} height={300} />
          <Text fontSize="2xl" textAlign="center">
            Contact Not Found
          </Text>
        </Flex>
      )}
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
    </div>
  );
}

export default WithAuth(ContactUs, USER_TYPE.Admin);