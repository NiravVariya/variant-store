import { db } from "@/firebase/client";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

function SocialMediaLinks() {
  const [SocialMediaLinks, setSocialMediaLinks] = useState({
    title: { en: "", ar: "" },
    link: "",
  });
  const [docId, setDocId] = useState("");
  const [editLinkId, setEditLinkId] = useState("");
  const [socialMediaList, setSocialMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaLinksError, setMediaLinksError] = useState({
    title: { en: "", ar: "" },
    link: "",
  });
  const inputRef = useRef(null);

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
        "SocialMediaLinks"
      );
      onSnapshot(settingStoreRef, (settingSnap: any) => {
        setSocialMediaList(
          settingSnap.docs.map((docvalue: any) => ({
            ...docvalue.data(),
            id: docvalue.id,
          }))
        );
      });
    }
  }, [docId]);

  const handleMedialLink = async () => {
    const settingStoreRef = doc(
      collection(db, "storeSetting", docId, "SocialMediaLinks")
    );

    if (
      SocialMediaLinks.title.en == "" ||
      SocialMediaLinks.title.ar == "" ||
      SocialMediaLinks.link == ""
    ) {
      setMediaLinksError({
        title: {
          en: SocialMediaLinks.title.en == "" ? "Title must be requied" : "",
          ar:
            SocialMediaLinks.title.ar == ""
              ? "Title in Arabic must be requied"
              : "",
        },
        link: SocialMediaLinks.link == "" ? "Link must be requied" : "",
      });
    } else {
      if (editLinkId) {
        const updateStoreRef = doc(
          db,
          "storeSetting",
          docId,
          "SocialMediaLinks",
          editLinkId
        );
        setIsLoading(true);
        await updateDoc(updateStoreRef, SocialMediaLinks).then(() => {
          toast.success("Link Updated successfull");
          setSocialMediaLinks({
            title: { en: "", ar: "" },
            link: "",
          });
          setEditLinkId("");
          setIsLoading(false);
        });
      } else {
        setIsLoading(true);
        await setDoc(settingStoreRef, SocialMediaLinks).then(() => {
          toast.success("added successfull");
          setSocialMediaLinks({
            title: { en: "", ar: "" },
            link: "",
          });
          setIsLoading(false);
        });
      }
    }
  };

  const handelEdit = (data: any) => {
    console.log("id====================>", data.id);
    inputRef.current.focus();
    setEditLinkId(data.id);
    setSocialMediaLinks({
      title: { en: data.title.en, ar: data.title.ar },
      link: data.link,
    });
  };

  const handelDelete = async (data: any) => {
    if (data.id) {
      // delete Links
      const deleteService = doc(
        db,
        "storeSetting",
        docId,
        "SocialMediaLinks",
        data.id
      );
      await deleteDoc(deleteService).then(() => {
        setIsLoading(false);
        setSocialMediaLinks({
          title: { en: "", ar: "" },
          link: "",
        });
        toast.success("Link deleted...");
      });
    }
  };

  return (
    <React.Fragment>
      <Heading size={"sm"} mb={5}>
        Manage Social Links
      </Heading>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={4}
      >
        <FormControl isRequired>
          <FormLabel fontSize={15}>Social Icon Title</FormLabel>
          <Input
            ref={inputRef}
            placeholder="Social Icon Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={SocialMediaLinks.title.en}
            onChange={(e) => {
              setSocialMediaLinks({
                ...SocialMediaLinks,
                title: { en: e.target.value, ar: "" },
              });
              setMediaLinksError({
                ...mediaLinksError,
                title: { en: "", ar: mediaLinksError.title.ar },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {mediaLinksError.title.en ? `*${mediaLinksError.title.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Social Icon Title (Arabic)</FormLabel>
          <Input
            placeholder="Social Icon Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={SocialMediaLinks.title.ar}
            onChange={(e) => {
              setSocialMediaLinks({
                ...SocialMediaLinks,
                title: { en: SocialMediaLinks.title.en, ar: e.target.value },
              });
              setMediaLinksError({
                ...mediaLinksError,
                title: { en: "", ar: "" },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {mediaLinksError.title.ar ? `*${mediaLinksError.title.ar}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Social Link</FormLabel>
          <Input
            placeholder="Social Link"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={SocialMediaLinks.link}
            onChange={(e) => {
              setSocialMediaLinks({
                ...SocialMediaLinks,
                link: e.target.value,
              });
              setMediaLinksError({
                ...mediaLinksError,
                link: "",
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {mediaLinksError.link ? `*${mediaLinksError.link}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Button
        variant="primary"
        type="submit"
        mb={7}
        onClick={() => handleMedialLink()}
      >
        {isLoading ? <Spinner /> : editLinkId ? "Update Link" : "Submit Links"}
      </Button>

      <TableContainer
        mb={10}
        display={socialMediaList.length == 0 ? "none" : "block"}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th align="center">#</Th>
              <Th align="center">Title</Th>
              <Th align="left">Edit</Th>
              <Th align="left">Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {socialMediaList &&
              socialMediaList.map((data, index) => {
                return (
                  <React.Fragment key={index}>
                    <Tr style={{ marginBottom: "20px" }}>
                      <Td align="center">{index + 1}</Td>
                      <Td align="center">{data.title.en}</Td>
                      <Td>
                        <IconButton
                          variant="primary"
                          aria-label="Search database"
                          icon={<FiEdit />}
                          fontSize={"xl"}
                          onClick={() => handelEdit(data)}
                        />
                      </Td>
                      <Td>
                        <IconButton
                          variant="primary"
                          aria-label="Search database"
                          icon={<MdDelete />}
                          fontSize={"xl"}
                          onClick={() => handelDelete(data)}
                        />
                      </Td>
                    </Tr>
                  </React.Fragment>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

export default SocialMediaLinks;
