import { db, storage } from "@/firebase/client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Dropzone from "@/components/Common/Dropzone";
import useImage from "@/hooks/useImage";
import { toast } from "react-hot-toast";
import { ref } from "firebase/storage";

function Categoryform(props: any) {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryTitleAr, setCategoryTitleAr] = useState("");
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorNameArMessage, setErrorNameArMessage] = useState("");
  const [errorImageMessage, setErrorImageMessage] = useState("");
  const [imageFile, setImageFile] = useState("");

  const [fileInputRef, imageUrl, _, handleFileUpload] = useImage();

  const handleChanges = (e: any) => {
    setCategoryTitle(e.target.value);
    setErrorNameMessage("");
  };
  // ** Add category
  const handleSubmit = async () => {
    if (categoryTitle === "") {
      setErrorNameMessage("Category Name is required.");
    } else if (categoryTitleAr === "") {
      setErrorNameArMessage("Category Name in Arabic is required.");
    } else if (!imageUrl && !imageFile) {
      setErrorImageMessage("Category Image is required.");
    } else {
      if (props.editId) {
        const updatePLAN = doc(db, "Categories", props.editId);
        await updateDoc(updatePLAN, {
          category: { en: categoryTitle, ar: categoryTitleAr },
          image: imageUrl || imageFile,
          updatedAt: serverTimestamp(),
        }).then(() => {
          setCategoryTitle("");
          setErrorNameMessage("");
          setErrorNameArMessage("");
          setErrorImageMessage("");
          props.modelClose();
        });
        toast.success("data submited.................");
      } else {
        
        const newCityRef = doc(collection(db, "Categories"));
        await setDoc(newCityRef, {
          category: { en: categoryTitle, ar: categoryTitleAr },
          image: imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          setCategoryTitle("");
          setErrorNameMessage("");
          setErrorNameArMessage("");
          setErrorImageMessage("");
          props.modelClose();
        });
        toast.success("data submited.................");
      }
    }
  };

  useEffect(() => {
    const fetchserviceDetail = async () => {
      const docRef = doc(db, "Categories", props.editId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const httpsReference = ref(storage, data.image);
        setCategoryTitle(data.category.en);
        setCategoryTitleAr(data.category.ar);
        setImageFile(data.image);
      } else {
        console.log("No such document!");
      }
    };

    if (props.editId) {
      fetchserviceDetail();
    } else {
      setCategoryTitle("");
      setImageFile("");
    }
  }, [props.editId]);
  return (
    <>
      <FormControl>
        <FormLabel>Category Name</FormLabel>
        <Input
          type="text"
          value={categoryTitle}
          borderColor={errorNameMessage ? "red" : ""}
          mb={errorNameMessage ? 0 : 5}
          onChange={handleChanges}
        />
        <FormHelperText style={{ color: "red" }} mb={5}>
          {errorNameMessage ? errorNameMessage : ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Category Name (Arabic)</FormLabel>
        <Input
          type="text"
          value={categoryTitleAr}
          borderColor={errorNameArMessage ? "red" : ""}
          mb={errorNameArMessage ? 0 : 5}
          onChange={(e) => {
            setCategoryTitleAr(e.target.value);
            setErrorNameArMessage("");
          }}
        />
        <FormHelperText style={{ color: "red" }} mb={5}>
          {errorNameArMessage ? errorNameArMessage : ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Dropzone
          path={`Category`}
          fileInputRef={fileInputRef}
          onUpload={handleFileUpload}
          uploadedImage={imageUrl ? imageUrl : imageFile}
        />
        <FormHelperText style={{ color: "red" }} mb={5}>
          {errorImageMessage ? errorImageMessage : ""}
        </FormHelperText>
      </FormControl>
      <ModalFooter>
        <Button variant="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </ModalFooter>
    </>
  );
}
export default Categoryform;
