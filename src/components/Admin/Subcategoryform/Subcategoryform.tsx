import React, { useEffect, useState } from "react";
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
import Dropzone from "@/components/Common/Dropzone";
import useImage from "@/hooks/useImage";
import { toast } from "react-hot-toast";
import { ref } from "firebase/storage";

function Subcategoryform(props: any) {
  const { categotyId, editId } = props;

  const [subCategoryTitle, setSubCategoryTitle] = useState("");
  const [subCategoryTitleAr, setSubCategoryTitleAr] = useState("");
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorNameArMessage, setErrorNameArMessage] = useState("");
  const [errorImageMessage, setErrorImageMessage] = useState("");
  const [imageFile, setImageFile] = useState("");

  const [fileInputRef, imageUrl, _, handleFileUpload] = useImage();

  // ** Add category
  const handleSubmit = async () => {
    if (subCategoryTitle === "") {
      setErrorNameMessage("SubCategory Name is required.");
    } else if (subCategoryTitleAr === "") {
      setErrorNameArMessage("SubCategory Name in Arabic is required.");
    } else if (!imageUrl && !imageFile) {
      setErrorImageMessage("SubCategory Image is required.");
    } else {
      if (editId) {
        const updatePLAN = doc(
          db,
          "Categories",
          categotyId,
          "Subcategory",
          editId
        );
        await updateDoc(updatePLAN, {
          subcategory: { en: subCategoryTitle, ar: subCategoryTitleAr },
          image: imageUrl || imageFile,
          updatedAt: serverTimestamp(),
        }).then(() => {
          setSubCategoryTitle("");
          setErrorNameMessage("");
          setErrorNameArMessage("");
          setErrorImageMessage("");
          props.modelClose();
        });
        toast.success("data submited.................");
      } else {
        const newCityRef = doc(
          collection(db, "Categories", categotyId, "Subcategory")
        );
        await setDoc(newCityRef, {
          subcategory: { en: subCategoryTitle, ar: subCategoryTitleAr },
          image: imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          setSubCategoryTitle("");
          setErrorNameMessage("");
          setErrorNameArMessage("");
          setErrorImageMessage("");
          props.modelClose();
        });
        toast.success("data submited.................");
      }
    }
  };

  const fetchserviceDetail = async () => {
    const Subdocref = doc(db, "Categories", categotyId, "Subcategory", editId);
    const docSnap = await getDoc(Subdocref);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const httpsReference = ref(storage, data.image);
      setSubCategoryTitle(data.subcategory.en);
      setSubCategoryTitleAr(data.subcategory.ar)
      setImageFile(data.image);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (editId) {
      fetchserviceDetail();
    } else {
      setSubCategoryTitle("");
      setImageFile("");
    }
  }, [editId]);
  return (
    <div>
      <FormControl>
        <FormLabel>Category Name</FormLabel>
        <Input
          type="text"
          value={subCategoryTitle}
          borderColor={errorNameMessage ? "red" : ""}
          mb={errorNameMessage ? 0 : 5}
          onChange={(e) => {
            setSubCategoryTitle(e.target.value);
            setErrorNameMessage("");
          }}
        />
        <FormHelperText style={{ color: "red" }} mb={5}>
          {errorNameMessage ? errorNameMessage : ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Category Name (Arabic)</FormLabel>
        <Input
          type="text"
          value={subCategoryTitleAr}
          borderColor={errorNameArMessage ? "red" : ""}
          mb={errorNameArMessage ? 0 : 5}
          onChange={(e) => {
            setSubCategoryTitleAr(e.target.value);
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
    </div>
  );
}

export default Subcategoryform;
