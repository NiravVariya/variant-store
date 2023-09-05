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
import React, { useEffect, useState } from "react";
import DropImgBox from "@/components/Admin/DropImgBox/DropImgBox";
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function OfferBanner() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [bannerHeading, setBannerHeading] = useState({
        en: "",
        ar: "",
    });
    const [bannerIntoLine, setBannerIntoLine] = useState({
        en: "",
        ar: "",
    });
    const [offerBanner, setOfferBanner] = useState("");
    const offerBannerInput = React.useRef(null);
    const [storeErrors, setStoreErrors] = useState({
        offerBanner: "",
        bannerHeading: { en: "", ar: "" },
        bannerIntoLine: { en: "", ar: "" },
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setOfferBanner(reduxData.storeSetData.offerBenner?.img ?? "");
        setBannerHeading({
            en: reduxData.storeSetData.offerBenner?.heading?.en ?? "",
            ar: reduxData.storeSetData.offerBenner?.heading?.ar ?? "",
        });
        setBannerIntoLine({
            en: reduxData.storeSetData.offerBenner?.introLine?.en ?? "",
            ar: reduxData.storeSetData.offerBenner?.introLine?.ar ?? "",
        });
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));

        if (
            offerBanner == "" ||
            bannerIntoLine.en == "" ||
            bannerIntoLine.ar == "" ||
            bannerHeading.en == "" ||
            bannerHeading.ar == ""
        ) {
            setStoreErrors({
                ...storeErrors,
                offerBanner:
                    offerBanner == "" ? "OfferBanner Img must be required." : "",
                bannerIntoLine: {
                    en:
                        bannerIntoLine.en == ""
                            ? "Banner Intro Line must be required."
                            : "",
                    ar:
                        bannerIntoLine.ar == ""
                            ? "Banner Intro Line in Arabic must be required."
                            : "",
                },
                bannerHeading: {
                    en: bannerHeading.en == "" ? "Banner heading must be required." : "",
                    ar:
                        bannerHeading.ar == ""
                            ? "Banner heading in Arabic must be required."
                            : "",
                },
            });
        }
        else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    offerBenner: {
                        img: offerBanner,
                        heading: {
                            en: bannerHeading.en,
                            ar: bannerHeading.ar,
                        },
                        introLine: {
                            en: bannerIntoLine.en,
                            ar: bannerIntoLine.ar,
                        },
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    offerBenner: {
                        img: offerBanner,
                        heading: {
                            en: bannerHeading.en,
                            ar: bannerHeading.ar,
                        },
                        introLine: {
                            en: bannerIntoLine.en,
                            ar: bannerIntoLine.ar,
                        },
                    },
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
            Manage Offer Banner
        </Heading>

        <FormControl isRequired mb={{ base: 4, md: 5 }}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <FormLabel fontSize={15}>Offer banner</FormLabel>
                <FormHelperText style={{ color: "red", marginTop: "0px !important" }}>
                    *Recommended Size: 1727 X 720
                </FormHelperText>
            </Flex>
            <DropImgBox
                storeLogo={offerBanner}
                setStoreLogo={setOfferBanner}
                storeLogoInput={offerBannerInput}
                setStoreErrors={setStoreErrors}
                storeErrors={storeErrors}
                width={1727}
                height={720}
            />
            <FormHelperText style={{ color: "red" }} mb={5}>
                {storeErrors.offerBanner ? `*${storeErrors.offerBanner}` : ""}
            </FormHelperText>
        </FormControl>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={4}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Banner intro line</FormLabel>
                <Input
                    placeholder="Banner intro line"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={bannerIntoLine.en}
                    onChange={(e) => {
                        setBannerIntoLine({
                            ...bannerIntoLine,
                            en: e.target.value,
                            ar: "",
                        });
                        setStoreErrors({
                            ...storeErrors,
                            bannerIntoLine: {
                                en: "",
                                ar: storeErrors.bannerIntoLine.ar,
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.bannerIntoLine.en
                        ? `*${storeErrors.bannerIntoLine.en}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Banner intro line (Arabic)</FormLabel>
                <Input
                    placeholder="Banner intro line"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={bannerIntoLine.ar}
                    onChange={(e) => {
                        setBannerIntoLine({
                            ...bannerIntoLine,
                            en: bannerIntoLine.en,
                            ar: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            bannerIntoLine: {
                                en: storeErrors.bannerIntoLine.en,
                                ar: "",
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.bannerIntoLine.ar
                        ? `*${storeErrors.bannerIntoLine.ar}`
                        : ""}
                </FormHelperText>
            </FormControl>
        </Grid>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={4}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Banner heading</FormLabel>
                <Input
                    placeholder="Banner heading"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={bannerHeading.en}
                    onChange={(e) => {
                        setBannerHeading({
                            ...bannerHeading,
                            en: e.target.value,
                            ar: "",
                        });
                        setStoreErrors({
                            ...storeErrors,
                            bannerHeading: {
                                en: "",
                                ar: storeErrors.bannerHeading.ar,
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.bannerHeading.en
                        ? `*${storeErrors.bannerHeading.en}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Banner heading (Arabic)</FormLabel>
                <Input
                    placeholder="Banner heading"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={bannerHeading.ar}
                    onChange={(e) => {
                        setBannerHeading({
                            ...bannerHeading,
                            en: bannerHeading.en,
                            ar: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            bannerHeading: {
                                en: storeErrors.bannerHeading.en,
                                ar: "",
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.bannerHeading.ar
                        ? `*${storeErrors.bannerHeading.ar}`
                        : ""}
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

export default OfferBanner;