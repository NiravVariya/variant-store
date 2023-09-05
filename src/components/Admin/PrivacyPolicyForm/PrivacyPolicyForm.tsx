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

function PrivacyPolicyForm(props: any) {
  const [privacyTitle, setPrivacyTitle] = useState({
    en: "",
    ar: "",
  });
  const [privacyDescription, setPrivacyDescription] = useState({
    en: "",
    ar: "",
  });
  const [privacyError, setPrivacyError] = useState({
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
        "PrivacyPolicy",
        props.editId
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPrivacyTitle({ en: data.title.en, ar: data.title.ar });
        setPrivacyDescription({
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
      setPrivacyTitle({ en: "", ar: "" });
      setPrivacyDescription({ en: "", ar: "" });
    }
  }, [props.editId, docId]);

  const handlePrivacyPolicy = async () => {
    if (privacyTitle.en == "" || privacyTitle.ar == "") {
      setPrivacyError({
        ...privacyError,
        title: {
          en: privacyTitle.en == "" ? "Title must be requied" : "",
          ar: privacyTitle.ar == "" ? "Title in Arabic must be requied" : "",
        },
      });
    } else if (privacyDescription.en == "" || privacyDescription.ar == "") {
      setPrivacyError({
        ...privacyError,
        desc: {
          en: privacyDescription.en == "" ? "Description must be requied" : "",
          ar:
            privacyDescription.ar == ""
              ? "Description in Arabic must be requied"
              : "",
        },
      });
    } else {
      const settingStoreRef = doc(
        collection(db, "storeSetting", docId, "PrivacyPolicy")
      );
      setIsLoading(true);
      if (props.editId) {
        const updateDocRef = doc(
          db,
          "storeSetting",
          docId,
          "PrivacyPolicy",
          props.editId
        );
        await updateDoc(updateDocRef, {
          title: privacyTitle,
          description: privacyDescription,
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("updated successfull");
          setPrivacyTitle({ en: "", ar: "" });
          setPrivacyDescription({ en: "", ar: "" });
          props.modelClose();
          setIsLoading(false);
        });
      } else {
        await setDoc(settingStoreRef, {
          title: privacyTitle,
          description: privacyDescription,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("added successfull");
          setPrivacyTitle({ en: "", ar: "" });
          setPrivacyDescription({ en: "", ar: "" });
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
            placeholder="Privacy Policy Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={privacyTitle.en}
            onChange={(e) => {
              setPrivacyTitle({
                ...privacyTitle,
                en: e.target.value,
                ar: "",
              });
              setPrivacyError({
                ...privacyError,
                title: {
                  en: "",
                  ar: privacyError.title.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {privacyError.title.en ? `*${privacyError.title.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Title (Arabic)</FormLabel>
          <Input
            placeholder="Privacy Policy Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={privacyTitle.ar}
            onChange={(e) => {
              setPrivacyTitle({
                ...privacyTitle,
                en: privacyTitle.en,
                ar: e.target.value,
              });
              setPrivacyError({
                ...privacyError,
                title: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {privacyError.title.ar ? `*${privacyError.title.ar}` : ""}
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
            placeholder="Privacy Policy Description"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"97%"}
            // height={81}
            value={privacyDescription.en}
            onChange={(e) => {
              setPrivacyDescription({
                ...privacyDescription,
                en: e.target.value,
                ar: "",
              });
              setPrivacyError({
                ...privacyError,
                desc: {
                  en: "",
                  ar: privacyError.desc.ar,
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {privacyError.desc.en ? `*${privacyError.desc.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Descriptions (Arabic)</FormLabel>
          <Textarea
            placeholder="Privacy Policy Description"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"97%"}
            // height={81}
            value={privacyDescription.ar}
            onChange={(e) => {
              setPrivacyDescription({
                ...privacyDescription,
                en: privacyDescription.en,
                ar: e.target.value,
              });
              setPrivacyError({
                ...privacyError,
                desc: {
                  en: "",
                  ar: "",
                },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {privacyError.desc.ar ? `*${privacyError.desc.ar}` : ""}
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

export default PrivacyPolicyForm;
