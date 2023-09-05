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
} from "@chakra-ui/react";
import {
    collection,
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import DropMultiImgBox from "@/components/Admin/DropImgBox/DropMultiImgBox";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function PromotingImages() {
    const [promotingImgs, setPromotingImgs] = useState([]);
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const promotingImgsInput = React.useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [promotionImageLink, setPromotionImageLink] = useState({
        firstImageLink: "",
        secondImageLink: "",
    });
    const [storeErrors, setStoreErrors] = useState({
        promotingImgs: "",
        promotionImageLink: {
            firstImageLink: "",
            secondImageLink: "",
        }
    });
    const handleDeletePromotingImage = (id: number) => {
        const newArrayImg = promotingImgs.filter(
            (data, index: number) => index !== id
        );
        setPromotingImgs(newArrayImg);
    };

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setPromotingImgs(reduxData.storeSetData.promotingImgs ?? []);
        setPromotionImageLink({
            firstImageLink: reduxData.storeSetData.promotionImageLink?.firstImageLink ?? "",
            secondImageLink: reduxData.storeSetData.promotionImageLink?.secondImageLink ?? "",
        })
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));
        if (
            promotingImgs.length == 0 ||
            promotionImageLink.firstImageLink == "" ||
            promotionImageLink.secondImageLink == ""
        ) {
            setStoreErrors({
                ...storeErrors,
                promotingImgs:
                    promotingImgs.length == 0 ? "promotingImgs Img must be required." : "", 
                promotionImageLink: {
                    firstImageLink:
                        promotionImageLink.firstImageLink == ""
                            ? "First Image Link must be required."
                            : "",
                    secondImageLink:
                        promotionImageLink.secondImageLink == ""
                            ? "Second Image Link must be required."
                            : "",
                },
            });
        }
        else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    promotingImgs: promotingImgs,
                    promotionImageLink: promotionImageLink,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    promotingImgs: promotingImgs,
                    promotionImageLink: promotionImageLink,
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("updated successfully");
                    setIsLoading(false);
                });
            }
        }
    };

    return (<>
        <Heading size={"sm"} mb={5}>
            Manage Promoting Images
        </Heading>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(1, 1fr)" }}
            gap={6}
            mb={10}
        >
            <FormControl isRequired>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <FormLabel fontSize={15}>Promoting Images</FormLabel>
                    <FormHelperText
                        style={{ color: "red", marginTop: "0px !important" }}
                    >
                        *Recommended Size: 840 X 700
                    </FormHelperText>
                </Flex>

                <DropMultiImgBox
                    storeLogo={promotingImgs}
                    setStoreLogo={setPromotingImgs}
                    storeLogoInput={promotingImgsInput}
                    handleDeleteImage={handleDeletePromotingImage}
                    promoting={true}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    width={840}
                    height={700}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.promotingImgs ? `*${storeErrors.promotingImgs}` : ""}
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={4}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>First Image Redirect Link</FormLabel>
                <Input
                    placeholder="Add Image Redirect Link"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={promotionImageLink.firstImageLink}
                    onChange={(e) => {
                        setPromotionImageLink({
                            ...promotionImageLink,
                            firstImageLink: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            promotionImageLink: {
                                firstImageLink: "",
                                secondImageLink: storeErrors.promotionImageLink.secondImageLink,
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.promotionImageLink.firstImageLink
                        ? `*${storeErrors.promotionImageLink.firstImageLink}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Second Image Redirect Link</FormLabel>
                <Input
                    placeholder="Add Image Redirect Link"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={promotionImageLink.secondImageLink}
                    onChange={(e) => {
                        setPromotionImageLink({
                            ...promotionImageLink,
                            firstImageLink: promotionImageLink.firstImageLink,
                            secondImageLink: e.target.value
                        });
                        setStoreErrors({
                            ...storeErrors,
                            promotionImageLink: {
                                firstImageLink: storeErrors.promotionImageLink.firstImageLink,
                                secondImageLink: "",
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.promotionImageLink.secondImageLink
                        ? `*${storeErrors.promotionImageLink.secondImageLink}`
                        : ""}
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

export default PromotingImages;