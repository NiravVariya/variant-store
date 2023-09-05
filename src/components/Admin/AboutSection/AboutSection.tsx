import { db } from "@/firebase/client";
import {
  Button,
  Flex,
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
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DropMultiImgBox from "../DropImgBox/DropMultiImgBox";

function AboutSection() {
  const [aboutInfo, setAboutInfo] = useState({
    title: { en: "", ar: "" },
    desc: { en: "", ar: "" },
  });
  const [aboutInfoError, setAboutInfoError] = useState({
    title: { en: "", ar: "" },
    desc: { en: "", ar: "" },
    img: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [docId, setDocId] = useState("");
  const [aboutDoc, setAboutDoc] = useState();
  const aboutImgsInput = React.useRef(null);
  const [aboutImges, setAboutImges] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
      const aboutRef = collection(db, "storeSetting", docId, "AboutUs");
      onSnapshot(aboutRef, (settingSnap: any) => {
        settingSnap.docs &&
          settingSnap.docs.map((docvalue: any) => {
            if (docvalue) {
              const dataref: any = doc(
                db,
                "storeSetting",
                docId,
                "AboutUs",
                docvalue.id
              );
              setAboutDoc(dataref);
              setAboutInfo({
                title: {
                  en: docvalue.data().title.en,
                  ar: docvalue.data().title.ar,
                },
                desc: {
                  en: docvalue.data().desc.en,
                  ar: docvalue.data().desc.ar,
                },
              });
              setAboutImges(docvalue.data().aboutImges);
            }
          });
      });
    }
  }, [docId]);

  const handleDeleteAboutImage = (id: number) => {
    const newArrayImg = aboutImges.filter((data, index: number) => index !== id);
    setAboutImges(newArrayImg);
  };

  const handleAboutInfo = () => {
    if (aboutInfo.title.en == "" || aboutInfo.title.ar == "") {
      setAboutInfoError({
        ...aboutInfoError,
        title: {
          en: aboutInfo.title.en == "" ? "Title must be requied" : "",
          ar: aboutInfo.title.ar == "" ? "Title in Arabic must be requied" : "",
        },
      });
    } else if (aboutInfo.desc.en == "" || aboutInfo.desc.ar == "") {
      setAboutInfoError({
        ...aboutInfoError,
        desc: {
          en: aboutInfo.desc.en == "" ? "Description must be requied" : "",
          ar:
            aboutInfo.desc.ar == ""
              ? "Description in Arabic must be requied"
              : "",
        },
      });
    } else if (aboutImges.length == 0) {
      setAboutInfoError({
        ...aboutInfoError,
        img: "At least one image is required.",
      });
    } else {
      setIsLoading(true);
      if (!aboutDoc) {
        const settingStoreRef = doc(
          collection(db, "storeSetting", docId, "AboutUs")
        );
        setDoc(settingStoreRef, {
          ...aboutInfo,
          aboutImges,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("added successfull");
          setIsLoading(false);
        });
      } else {
        updateDoc(aboutDoc, {
          ...aboutInfo,
          aboutImges,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          toast.success("Updated successfull");
          setIsLoading(false);
        });
      }
    }
  };
  return (
    <div>
      <Heading size={"sm"} mb={5}>
        Manage About Us
      </Heading>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
        gap={6}
        mb={4}
      >
        <FormControl isRequired>
          <FormLabel fontSize={15}>Title</FormLabel>
          <Input
            placeholder="Social Icon Title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={aboutInfo.title.en}
            onChange={(e) => {
              setAboutInfo({
                ...aboutInfo,
                title: { en: e.target.value, ar: "" },
              });
              setAboutInfoError({
                ...aboutInfoError,
                title: { en: "", ar: aboutInfoError.title.ar },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {aboutInfoError.title.en ? `*${aboutInfoError.title.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Title (Arabic)</FormLabel>
          <Input
            placeholder="about title"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            // height={81}
            type="text"
            value={aboutInfo.title.ar}
            onChange={(e) => {
              setAboutInfo({
                ...aboutInfo,
                title: { en: aboutInfo.title.en, ar: e.target.value },
              });
              setAboutInfoError({
                ...aboutInfoError,
                title: { en: "", ar: "" },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {aboutInfoError.title.ar ? `*${aboutInfoError.title.ar}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Description</FormLabel>
          <Textarea
            placeholder="Social Link"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            value={aboutInfo.desc.en}
            onChange={(e) => {
              setAboutInfo({
                ...aboutInfo,
                desc: { en: e.target.value, ar: "" },
              });
              setAboutInfoError({
                ...aboutInfoError,
                desc: { en: "", ar: aboutInfoError.title.ar },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {aboutInfoError.desc.en ? `*${aboutInfoError.desc.en}` : ""}
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize={15}>Description (Arabic)</FormLabel>
          <Textarea
            placeholder="About Description"
            _focus={{ borderColor: "grey" }}
            ms={0.5}
            width={"95%"}
            value={aboutInfo.desc.ar}
            onChange={(e) => {
              setAboutInfo({
                ...aboutInfo,
                desc: { en: aboutInfo.desc.en, ar: e.target.value },
              });
              setAboutInfoError({
                ...aboutInfoError,
                desc: { en: "", ar: "" },
              });
            }}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {aboutInfoError.desc.ar ? `*${aboutInfoError.desc.ar}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid
        templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(1, 1fr)" }}
        gap={6}
        mb={0}
      >
        <FormControl isRequired>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <FormLabel fontSize={15}>About Images</FormLabel>
            <FormHelperText
              style={{ color: "red", marginTop: "0px !important", }}
            >
              *Recommended Size: 1727 X 720
            </FormHelperText>
          </Flex>
          <DropMultiImgBox
            storeLogo={aboutImges}
            setStoreLogo={setAboutImges}
            storeLogoInput={aboutImgsInput}
            handleDeleteImage={handleDeleteAboutImage}
            promoting={true}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            width={1727}
            height={720}
          />
          <FormHelperText style={{ color: "red" }} mb={5}>
            {aboutInfoError.img ? `*${aboutInfoError.img}` : ""}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Button
        variant="primary"
        type="submit"
        mb={7}
        onClick={() => handleAboutInfo()}
        isDisabled={isUploading ? true : false}
      >
        {isLoading ? (
          <Spinner />
        ) : aboutDoc !== undefined ? (
          "Update"
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
}

export default AboutSection;
