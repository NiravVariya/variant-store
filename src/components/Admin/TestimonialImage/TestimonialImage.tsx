import { Button, Flex, FormControl, FormHelperText, FormLabel, Grid, Heading, Spinner } from "@chakra-ui/react";
import DropImgBox from "../DropImgBox/DropImgBox";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";


function TestimonialImage() {
    const testimonialImgInput = React.useRef(null);
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [testimonialImg, setTestimonialImg] = useState("");
    const [storeErrors, setStoreErrors] = useState({
        testimonialImg: "",
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setTestimonialImg(structuredClone(reduxData.storeSetData.testimonial) ?? "")
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));

        if (testimonialImg == "") {
            setStoreErrors({
                ...storeErrors,
                testimonialImg:
                    testimonialImg == "" ? "Testimonial Img must be required." : "",
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    testimonial: testimonialImg,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then((success) => {
                    toast.success("added successfully");
                    setIsLoading(false);
                }).then((error) => {
                    console.log("error===============>", error);

                })
            } else {
                await updateDoc(settigDoc, {
                    testimonial: testimonialImg,
                    updatedAt: serverTimestamp(),
                }).then((success) => {
                    toast.success("updated successfully");
                    setIsLoading(false);
                }).then((error) => {
                    console.log("error===============>", error);

                })
            }
        }
    };

    return (<>
        <Heading size={"sm"} mb={5}>
            Manage Testimonial
        </Heading>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={2}
        >
            <FormControl isRequired>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <FormLabel fontSize={15}>Testimonial Image</FormLabel>
                    <FormHelperText
                        style={{ color: "red", marginTop: "0px !important" }}
                    >
                        *Recommended Size: 1727 X 715
                    </FormHelperText>
                </Flex>
                <DropImgBox
                    storeLogo={testimonialImg}
                    setStoreLogo={setTestimonialImg}
                    storeLogoInput={testimonialImgInput}
                    setStoreErrors={setStoreErrors}
                    storeErrors={storeErrors}
                    width={1727}
                    height={715}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.testimonialImg ? `*${storeErrors.testimonialImg}` : ""}
                </FormHelperText>
            </FormControl>
        </Grid>
        <Button
            variant="primary"
            type="submit"
            onClick={() => handleSubmitData()}
            mb={10}
        >
            {isLoading ? <Spinner /> : "Save"}
        </Button>

    </>)
}

export default TestimonialImage;