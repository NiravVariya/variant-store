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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Flex,
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
import DropMultiImgBox from "@/components/Admin/DropImgBox/DropMultiImgBox";
import { useSelector } from "react-redux";

function HomeSlider(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [settigDoc, setSettigDoc] = useState();
    const homeSlidersInput = React.useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [homeSliders, setHomeSliders] = useState([]);
    const [RedirectLink, setRedirectLink] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [imagesFiles, setImagesFiles] = useState([]);
    const [storeErrors, setStoreErrors] = useState({
        homeSliders: "",
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setHomeSliders(structuredClone(reduxData.storeSetData.homeSliders) ?? [])
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));

        if (homeSliders?.length == 0) {
            setStoreErrors({
                ...storeErrors,
                homeSliders:
                    homeSliders.length == 0 ? "At least one image is required." : "",
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    homeSliders: homeSliders,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    homeSliders: homeSliders,
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("updated successfully");
                    setIsLoading(false);
                });
            }
        }
    };

    const handleDeleteImage = (id: number) => {
        const newArrayImg = homeSliders.filter(
            (data, index: number) => index !== id
        );
        setHomeSliders(newArrayImg);
    };

    const submitLink = () => {
        let updatedHomeSlider: any[] = [...homeSliders]
        updatedHomeSlider[imageIndex].redirectLink = RedirectLink
        setHomeSliders(updatedHomeSlider)
        onClose();
    }

    return (<>
        <Heading size={"sm"} mb={5}>
            Manage Home Slider
        </Heading>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(1, 1fr)" }}
            gap={6}
            mb={3}
        >
            <FormControl isRequired>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <FormLabel fontSize={15}>Home Slider</FormLabel>
                    <FormHelperText
                        style={{ color: "red", marginTop: "0px !important", }}
                    >
                        *Recommended Size: 1727 X 715
                    </FormHelperText>
                </Flex>
                <DropMultiImgBox
                    storeLogo={homeSliders}
                    setStoreLogo={setHomeSliders}
                    storeLogoInput={homeSlidersInput}
                    handleDeleteImage={handleDeleteImage}
                    setImagesFiles={setImagesFiles}
                    imagesFiles={imagesFiles}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    width={1727}
                    height={715}
                    isOpenModel={true}
                    onOpen={onOpen}
                    handleIndex={(index: any) => {
                        setRedirectLink(homeSliders[index].redirectLink)
                        setImageIndex(index)
                    }}
                    redictLink={RedirectLink}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.homeSliders ? `*${storeErrors.homeSliders}` : ""}
                </FormHelperText>
            </FormControl>
        </Grid>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired mb={{ base: 0, md: 5 }}>
                        <FormLabel fontSize={15}>Add Image Redirect Link</FormLabel>
                        <Input
                            placeholder="Add Image Redirect Link"
                            _focus={{ borderColor: "grey" }}
                            ms={0.5}
                            width={"95%"}
                            type="text"
                            value={RedirectLink}
                            onChange={(e) => {
                                setRedirectLink(e.target.value)
                            }}
                        />
                    </FormControl>
                    <Button
                        float={"right"}
                        onClick={() => {
                            submitLink();
                        }}
                    >
                        Submit
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>

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

export default HomeSlider;