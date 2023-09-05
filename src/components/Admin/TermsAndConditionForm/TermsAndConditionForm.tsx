import { db } from "@/firebase/client";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function TermsAndConditionForm(props: any) {
  const [termsSectionTitle, setTermsSectionTitle] = useState({
    en: "",
    ar: "",
  });
  const [termsSectionDescription, setTermsSectionDescription] = useState({
    en: "",
    ar: "",
  });
  const [termsSectionError, setTermsSectionError] = useState({
    title: {
      en: "",
      ar: "",
    },
    desc: {
      en: "",
      ar: "",
    },
  });
  const [docId, setDocId] = useState("");
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
    const fetchserviceDetail = async () => {
      const docRef = doc(
        db,
        "storeSetting",
        docId,
        "TermsAndConditions",
        props.editId
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTermsSectionTitle({ en: data.title.en, ar: data.title.ar });
        setTermsSectionDescription({
          en: data.description.en,
          ar: data.description.ar,
        });
      } else {
        console.log("No such document!");
      }
    };

    if (props.editId && docId) {
      fetchserviceDetail();
    } else {
      setTermsSectionTitle({ en: "", ar: "" });
      setTermsSectionDescription({ en: "", ar: "" });
    }
  }, [props.editId, docId]);

  const handlePrivacyPolicy = async () => {
    if (termsSectionTitle.en == "" || termsSectionTitle.ar == "") {
      setTermsSectionError({
        ...termsSectionError,
        title: {
          en: termsSectionTitle.en == "" ? "Title must be requied" : "",
          ar: termsSectionTitle.ar == "" ? "Title in Arabic must be requied" : "",
        },
      });
    } else if (termsSectionDescription.en == "" || termsSectionDescription.ar == "") {
      setTermsSectionError({
        ...termsSectionError,
        desc: {
          en: termsSectionDescription.en == "" ? "Description must be requied" : "",
          ar:
            termsSectionDescription.ar == ""
              ? "Description in Arabic must be requied"
              : "",
        },
      });
    } else {
      const settingStoreRef = doc(
        collection(db, "storeSetting", docId, "TermsAndConditions")
      );
      setIsLoading(true);
      if (props.editId) {
        const updateDocRef = doc(
          db,
          "storeSetting",
          docId,
          "TermsAndConditions",
          props.editId
        );
        await updateDoc(updateDocRef, {
          title: termsSectionTitle,
          description: termsSectionDescription,
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("updated successfull");
          setTermsSectionTitle({ en: "", ar: "" });
          setTermsSectionDescription({ en: "", ar: "" });
          props.modelClose();
          setIsLoading(false);
        });
      } else {
        await setDoc(settingStoreRef, {
          title: termsSectionTitle,
          description: termsSectionDescription,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("added successfull");
          setTermsSectionTitle({ en: "", ar: "" });
          setTermsSectionDescription({ en: "", ar: "" });
          props.modelClose();
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <div>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
        gap={6}
        mb={0}
      >
        <FormControl isRequired>
          <FormLabel fontSize={15}>Title</FormLabel>
          <Input
            placeholder="Terms & Conditions Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={termsSectionTitle.en}
            onChange={(e) => {
              setTermsSectionTitle({
                ...termsSectionTitle,
                en: e.target.value,
                ar: "",
              });
              setTermsSectionError({
                ...termsSectionError,
                title: {
                  en: "",
                  ar: termsSectionError.title.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {termsSectionError.title.en ? `*${termsSectionError.title.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Title (Arabic)</FormLabel>
          <Input
            placeholder="Terms & Conditions Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={termsSectionTitle.ar}
            onChange={(e) => {
              setTermsSectionTitle({
                ...termsSectionTitle,
                en: termsSectionTitle.en,
                ar: e.target.value,
              });
              setTermsSectionError({
                ...termsSectionError,
                title: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {termsSectionError.title.ar ? `*${termsSectionError.title.ar}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(1, 1fr)" }}
        gap={0}
        mb={0}
      >
        <FormControl isRequired>
          <FormLabel fontSize={15}>Descriptions</FormLabel>
          <Textarea
            placeholder="Terms & Conditions Description"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"97%"}
            // height={81}
            value={termsSectionDescription.en}
            onChange={(e) => {
              setTermsSectionDescription({
                ...termsSectionDescription,
                en: e.target.value,
                ar: "",
              });
              setTermsSectionError({
                ...termsSectionError,
                desc: {
                  en: "",
                  ar: termsSectionError.desc.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {termsSectionError.desc.en ? `*${termsSectionError.desc.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Descriptions (Arabic)</FormLabel>
          <Textarea
            placeholder="Terms & Conditions Description"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"97%"}
            // height={81}
            value={termsSectionDescription.ar}
            onChange={(e) => {
              setTermsSectionDescription({
                ...termsSectionDescription,
                en: termsSectionDescription.en,
                ar: e.target.value,
              });
              setTermsSectionError({
                ...termsSectionError,
                desc: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {termsSectionError.desc.ar ? `*${termsSectionError.desc.ar}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Button
        variant="primary"
        type="submit"
        mb={7}
        onClick={() => handlePrivacyPolicy()}
      >
        {isLoading ? (
          <Spinner />
        ) : props.editId ? (
          "Update"
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
}

export default TermsAndConditionForm;