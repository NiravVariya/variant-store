import {
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    Spinner,
  } from "@chakra-ui/react";
  import StoreMainLogo from "../DropImgBox/StoreMainLogo";
  import React, { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import {
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "@/firebase/client";
  import { toast } from "react-hot-toast";
  import axios from "axios";
  import { MdEnhancedEncryption } from "react-icons/md";
  
  function StoreLogo() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const storeLogoInput = React.useRef(null);
    const [storeLogo, setStoreLogo] = useState('/images/logo.jpg');
    const [storeErrors, setStoreErrors] = useState({
      storeLogo: "",
    });
  
    const reduxData = useSelector((state: any) => state.icon);
    const gitBranch = reduxData.storeSetData?.gitBranch;
  
    useEffect(() => {
      // console.log("store logo..........", storeLogo);
      // setStoreLogo(reduxData.storeSetData.storeLogo ?? "");
      setSettigDoc(reduxData.storeSetDataRef);
    }, [reduxData]);
  
    const handleSubmitData = async () => {
      const settingStoreRef = doc(collection(db, "storeSetting"));
  
      if (storeLogo == "") {
        setStoreErrors({
          ...storeErrors,
          storeLogo: storeLogo == "" ? "Logo must be required." : "",
        });
      } else {
        setIsLoading(true);
        if (!gitBranch) {
          toast.error("git branch not found.........");
          setIsLoading(false);
          return;
        }
        try {
          const gitCommitUrl = "/api/logo/upload";
          const response = await axios.post(gitCommitUrl, {
            gitBranch,
            content: storeLogo,
          });
          toast.success(
            "Image is uploading. Please be patient this will take some time"
          );
          setIsLoading(false);
        } catch (error) {
          toast.error('Something went wrong. Try again later')
          console.log("error while uploading logo.........", error);
          setIsLoading(false);
          return;
        }
        //   if (settigDoc === undefined) {
        //     await setDoc(settingStoreRef, {
        //       storeLogo: storeLogo,
        //       createdAt: serverTimestamp(),
        //       updatedAt: serverTimestamp(),
        //     }).then(() => {
        //       toast.success("added successfully");
        //       setIsLoading(false);
        //     });
        //   } else {
        //     await updateDoc(settigDoc, {
        //       storeLogo: storeLogo,
        //       updatedAt: serverTimestamp(),
        //     }).then(() => {
        //       toast.success("updated successfully");
        //       setIsLoading(false);
        //     });
        //   }
      }
    };
  
    return (
      <>
        <Heading size={"sm"} mb={5}>
          Manage Store Logo
        </Heading>
        <Grid
          templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
          gap={6}
          mb={3}
        >
          <FormControl isRequired>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <FormLabel fontSize={15}>Site Logo </FormLabel>
              <FormHelperText style={{ color: "red", margin: "0 !important" }}>
                *Recommended Size: 300 X 300
              </FormHelperText>
            </Flex>
  
            <StoreMainLogo
              storeLogo={storeLogo}
              setStoreLogo={setStoreLogo}
              storeLogoInput={storeLogoInput}
              setStoreErrors={setStoreErrors}
              storeErrors={storeErrors}
              width={300}
              height={300}
            />
            <FormHelperText style={{ color: "red" }} mb={5}>
              {storeErrors.storeLogo ? `*${storeErrors.storeLogo}` : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
  
        {/* Add button */}
        <Button
          variant="primary"
          type="submit"
          onClick={() => handleSubmitData()}
          mb={10}
        >
          {isLoading ? <Spinner /> : "Save"}
        </Button>
      </>
    );
  }
  
  export default StoreLogo;