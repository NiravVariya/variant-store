import { db } from "@/firebase/client";
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
import {
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DropMultiImgBox from "@/components/Admin/DropImgBox/DropMultiImgBox";
import { useSelector } from "react-redux";

function TopBrandsLogos() {
    const brandLogosInput = React.useRef(null);
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [brandLogos, setBrandLogos] = useState([]);
    const [storeErrors, setStoreErrors] = useState({
        brandLogos: "",
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setBrandLogos(reduxData.storeSetData.brandLogos ?? [])
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));

        if (brandLogos?.length == 0) {
            setStoreErrors({
                ...storeErrors,
                brandLogos:
                    brandLogos.length == 0 ? "At least one logo is required." : "",
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    brandLogos: brandLogos,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    brandLogos: brandLogos,
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("updated successfully");
                    setIsLoading(false);
                });
            }
        }
    };

    const handleDeleteBrandLogos = (id: number) => {
        const newArrayImg = brandLogos.filter(
            (data, index: number) => index !== id
        );
        setBrandLogos(newArrayImg);
    };


    return (<>
        <Heading size={"sm"} mb={5}>
            Manage Brand Logos
        </Heading>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(1, 1fr)" }}
            gap={6}
            mb={3}
        >
            <FormControl isRequired>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <FormLabel fontSize={15}>Top Brand Logos</FormLabel>
                    <FormHelperText
                        style={{ color: "red", marginTop: "0px !important" }}
                    >
                        *Recommended Size: 180 X 135
                    </FormHelperText>
                </Flex>
                <DropMultiImgBox
                    storeLogo={brandLogos}
                    setStoreLogo={setBrandLogos}
                    storeLogoInput={brandLogosInput}
                    handleDeleteImage={handleDeleteBrandLogos}
                    width={180}
                    height={135}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.brandLogos ? `*${storeErrors.brandLogos}` : ""}
                </FormHelperText>
            </FormControl>
        </Grid>
        <Button
            variant="primary"
            type="submit"
            onClick={() => handleSubmitData()}
            mb={10}
            isDisabled={isUploading ? true : false}
        >
            {isLoading ? <Spinner /> : "Save"}
        </Button>
    </>)
}

export default TopBrandsLogos;