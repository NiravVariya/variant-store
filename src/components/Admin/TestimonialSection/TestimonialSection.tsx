import { db } from "@/firebase/client";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
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

function TestimonialSection() {
  const [testimonialInfo, setTestimonialInfo] = useState({
    heading: { en: "", ar: "" },
    text: { en: "", ar: "" },
    name: { en: "", ar: "" },
    city: { en: "", ar: "" },
  });
  const [docId, setDocId] = useState("");
  const [testimonialErrors, setTestimonialErrors] = useState({
    heading: { en: "", ar: "" },
    text: { en: "", ar: "" },
    name: { en: "", ar: "" },
    city: { en: "", ar: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState("");
  const [TestimonialData, setTestimonialData] = useState([]);
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
      const TestimonialRef = collection(
        db,
        "storeSetting",
        docId,
        "TestimonialInfo"
      );
      onSnapshot(TestimonialRef, (testimonialSnap: any) => {
        setTestimonialData(
          testimonialSnap.docs.map((docvalue: any) => ({
            ...docvalue.data(),
            id: docvalue.id,
          }))
        );
      });
    }
  }, [docId]);

  const handleTestimonial = () => {
    const settingStoreRef = doc(
      collection(db, "storeSetting", docId, "TestimonialInfo")
    );

    if (testimonialInfo.heading.en == "" || testimonialInfo.heading.ar == "") {
      setTestimonialErrors({
        ...testimonialErrors,
        heading: {
          en: testimonialInfo.heading.en == "" ? "Heading must be requied" : "",
          ar:
            testimonialInfo.heading.ar == ""
              ? "Heading in Arabic must be requied"
              : "",
        },
      });
    } else if (testimonialInfo.text.en == "" || testimonialInfo.text.ar == "") {
      setTestimonialErrors({
        ...testimonialErrors,
        text: {
          en: testimonialInfo.text.en == "" ? "Text must be requied" : "",
          ar:
            testimonialInfo.text.ar == ""
              ? "Text in Arabic must be requied"
              : "",
        },
      });
    } else if (testimonialInfo.name.en == "" || testimonialInfo.name.ar == "") {
      setTestimonialErrors({
        ...testimonialErrors,
        name: {
          en: testimonialInfo.name.en == "" ? "Name must be requied" : "",
          ar:
            testimonialInfo.name.ar == ""
              ? "Name in Arabic must be requied"
              : "",
        },
      });
    } else if (testimonialInfo.city.en == "" || testimonialInfo.city.ar == "") {
      setTestimonialErrors({
        ...testimonialErrors,
        city: {
          en: testimonialInfo.city.en == "" ? "City name must be requied" : "",
          ar:
            testimonialInfo.city.ar == ""
              ? "City name in Arabic must be requied"
              : "",
        },
      });
    } else {
      if (editTestimonialId) {
        const updateStoreRef = doc(
          db,
          "storeSetting",
          docId,
          "TestimonialInfo",
          editTestimonialId
        );
        setIsLoading(true);
        updateDoc(updateStoreRef, testimonialInfo).then(() => {
          toast.success("Link Updated successfull");
          setTestimonialInfo({
            heading: { en: "", ar: "" },
            text: { en: "", ar: "" },
            name: { en: "", ar: "" },
            city: { en: "", ar: "" },
          });
          setEditTestimonialId("");
          setIsLoading(false);
        });
      } else {
        setIsLoading(true);
        setDoc(settingStoreRef, testimonialInfo).then(() => {
          toast.success("added successfull");
          setTestimonialInfo({
            heading: { en: "", ar: "" },
            text: { en: "", ar: "" },
            name: { en: "", ar: "" },
            city: { en: "", ar: "" },
          });
          setIsLoading(false);
        });
      }
    }
  };

  const handelEdit = (data: any) => {
    inputRef.current.focus();
    setEditTestimonialId(data.id);
    setTestimonialInfo({
      heading: { en: data.heading.en, ar: data.heading.ar },
      text: { en: data.text.en, ar: data.text.ar },
      name: { en: data.name.en, ar: data.name.ar },
      city: { en: data.city.en, ar: data.city.ar },
    });
  };

  const handelDelete = async (data: any) => {
    if (data.id) {
      // delete Links
      const deleteService = doc(
        db,
        "storeSetting",
        docId,
        "TestimonialInfo",
        data.id
      );
      await deleteDoc(deleteService).then(() => {
        setIsLoading(false);
        setTestimonialInfo({
          heading: { en: "", ar: "" },
          text: { en: "", ar: "" },
          name: { en: "", ar: "" },
          city: { en: "", ar: "" },
        });
        toast.success("Testimonial data deleted...");
      });
    }
  };

  return (
    <div>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
        gap={6}
        mb={4}
      >
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Testimonial Heading</FormLabel>
          <Input
            placeholder="Testimonial Heading"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            ref={inputRef}
            value={testimonialInfo.heading.en}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                heading: { en: e.target.value, ar: "" },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                heading: {
                  en: "",
                  ar: testimonialErrors.heading.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.heading.en
              ? `*${testimonialErrors.heading.en}`
              : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Testimonial Heading (Arabic)</FormLabel>
          <Input
            placeholder="Testimonial Heading"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.heading.ar}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                heading: { en: testimonialInfo.heading.en, ar: e.target.value },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                heading: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.heading.ar
              ? `*${testimonialErrors.heading.ar}`
              : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Testimonial Text</FormLabel>
          <Input
            placeholder="Testimonial Text"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.text.en}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                text: { en: e.target.value, ar: "" },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                text: {
                  en: "",
                  ar: testimonialErrors.text.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.text.en ? `*${testimonialErrors.text.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Testimonial Text (Arabic)</FormLabel>
          <Input
            placeholder="Testimonial Text"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.text.ar}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                text: { en: testimonialInfo.text.en, ar: e.target.value },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                text: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.text.ar ? `*${testimonialErrors.text.ar}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Auther Name</FormLabel>
          <Input
            placeholder="Auther Name"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.name.en}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                name: { en: e.target.value, ar: "" },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                name: {
                  en: "",
                  ar: testimonialErrors.name.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.name.en ? `*${testimonialErrors.name.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Auther Name (Arabic)</FormLabel>
          <Input
            placeholder="Auther Name"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.name.ar}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                name: { en: testimonialInfo.name.en, ar: e.target.value },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                name: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.name.ar ? `*${testimonialErrors.name.ar}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Auther City</FormLabel>
          <Input
            placeholder="Auther City"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.city.en}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                city: { en: e.target.value, ar: "" },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                city: {
                  en: "",
                  ar: testimonialErrors.city.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.city.en ? `*${testimonialErrors.city.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired mb={{ base: 0, md: 0 }}>
          <FormLabel fontSize={15}>Auther City (Arabic)</FormLabel>
          <Input
            placeholder="Auther City"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            type="text"
            value={testimonialInfo.city.ar}
            onChange={(e) => {
              setTestimonialInfo({
                ...testimonialInfo,
                city: { en: testimonialInfo.city.en, ar: e.target.value },
              });
              setTestimonialErrors({
                ...testimonialErrors,
                city: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {testimonialErrors.city.ar ? `*${testimonialErrors.city.ar}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Button
        variant="primary"
        type="submit"
        mb={7}
        onClick={() => handleTestimonial()}
      >
        {isLoading ? (
          <Spinner />
        ) : editTestimonialId ? (
          "Update"
        ) : (
          "Submit"
        )}
      </Button>

      <TableContainer
        mb={10}
        display={TestimonialData.length == 0 ? "none" : "block"}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th align="center">#</Th>
              <Th align="center">Heading</Th>
              <Th align="left">Name</Th>
              <Th align="left">Edit</Th>
              <Th align="left">Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {TestimonialData &&
              TestimonialData.map((item, index) => {
                return (
                  <Tr key={index} style={{ marginBottom: "20px" }}>
                    <Td align="center">{index + 1}</Td>
                    <Td align="center">{item.heading.en}</Td>
                    <Td>{item.name.en}</Td>
                    <Td>
                      <IconButton
                        variant="primary"
                        aria-label="Search database"
                        icon={<FiEdit />}
                        fontSize={"xl"}
                        onClick={() => handelEdit(item)}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        variant="primary"
                        aria-label="Search database"
                        icon={<MdDelete />}
                        fontSize={"xl"}
                        onClick={() => handelDelete(item)}
                      />
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TestimonialSection;
