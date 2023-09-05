import TermsAndConditionForm from "@/components/Admin/TermsAndConditionForm/TermsAndConditionForm";
import { db } from "@/firebase/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

function TermsAndConditions() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [docId, setDocId] = useState("");
  const [editId, setEditId] = useState("");
  const [termsConditionList, setTermsConditionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap) => {
      settingSnap.docs.map((value) => {
        const dataref: any = doc(db, "storeSetting", value.id);
        setDocId(dataref.id);
      });
    });
  }, []);

  useEffect(() => {
    if (docId) {
      const settingStoreRef = collection(
        db,
        "storeSetting",
        docId,
        "TermsAndConditions"
      );
      const categoryQueryRef = query(
        settingStoreRef,
        orderBy("createdAt", "asc")
      );
      setIsLoading(true);
      onSnapshot(categoryQueryRef, (settingSnap: any) => {
        setTermsConditionList(
          settingSnap.docs.map((docvalue: any) => ({
            ...docvalue.data(),
            id: docvalue.id,
          }))
        );
        setIsLoading(false);
      });
    }
  }, [docId]);

  const handelDelete = async (id: string) => {
    if (id) {
      const deleteService = doc(
        db,
        "storeSetting",
        docId,
        "TermsAndConditions",
        id
      );
      setIsLoading(true);
      await deleteDoc(deleteService).then(() => {
        setIsLoading(false);
        toast.success("document deleted sucessfully");
      });
    }
  };

  return (
    <div>
      <Flex
        minWidth="max-content"
        alignItems={{ base: "", md: "center" }}
        gap="2"
        direction={{ base: "column", lg: "row" }}
        mb={10}
      >
        <Box p="2">
          <Heading size="md">Manage Terms And Conditions</Heading>
        </Box>
        <Spacer />
        `<Flex gap="2" direction={{ base: "column", sm: "row" }}>
          <ButtonGroup gap="2">
            <Button
              variant="primary"
              width={{ base: "100%", md: "auto" }}
              leftIcon={<AddIcon />}
              onClick={() => {
                onOpen();
                setEditId("");
              }}
            >
              Add
            </Button>
          </ButtonGroup>
        </Flex>`
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
          {termsConditionList &&
            termsConditionList.map((data, index) => {
              return (
                <Stack mb={4} key={index}>
                  <Flex alignItems={"center"} justifyContent={""}>
                    <Heading fontSize={"2xl"}>{data.title.en}</Heading>
                    <Flex>
                      <Tooltip hasArrow label={"Edit"}>
                        <IconButton
                          colorScheme=""
                          aria-label="Search database"
                          icon={<FiEdit />}
                          fontSize={"xl"}
                          color={"#000"}
                          onClick={() => {
                            setEditId(data.id);
                            onOpen();
                          }}
                          width={8}
                          height={9}
                        />
                      </Tooltip>
                      <Tooltip hasArrow label={"Delete"}>
                        <IconButton
                          colorScheme=""
                          color={"#000"}
                          aria-label="Search database"
                          icon={<AiOutlineDelete />}
                          fontSize={"xl"}
                          onClick={() => handelDelete(data.id)}
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Text>{data.description.en}</Text>
                </Stack>
              );
            })}
        </>
      )}

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={"4xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? "Edit Terms & Conditions" : "Add Terms & Conditions"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TermsAndConditionForm modelClose={onClose} editId={editId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TermsAndConditions;