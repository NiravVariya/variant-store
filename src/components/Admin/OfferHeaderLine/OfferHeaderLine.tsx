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
} from "@chakra-ui/react";
import {
    collection,
    doc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function OfferHeaderLine() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [offerHeading, setOfferHeading] = useState({
        en: "",
        ar: "",
    });
    const [storeErrors, setStoreErrors] = useState({
        offerHeading: { en: "", ar: "" },
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setOfferHeading(reduxData.storeSetData?.offerHeading ?? "")
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));
        if (offerHeading.en == "" || offerHeading.ar == "") {
            setStoreErrors({
                ...storeErrors,
                offerHeading: {
                    en: offerHeading.en == "" ? "Offer heading must be required." : "",
                    ar:
                        offerHeading.ar == ""
                            ? "Offer heading in Arabic must be required."
                            : "",
                },
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    offerHeading: offerHeading,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    offerHeading: offerHeading,
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
            Manage Offer Header Line
        </Heading>

        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Offer Heading</FormLabel>
                <Input
                    placeholder="Offer Heading"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={offerHeading?.en}
                    onChange={(e) => {
                        setOfferHeading({
                            ...offerHeading,
                            en: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            offerHeading: {
                                en: "",
                                ar: storeErrors.offerHeading.ar,
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.offerHeading.en
                        ? `*${storeErrors.offerHeading.en}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Offer Heading (Arabic)</FormLabel>
                <Input
                    placeholder="Offer Heading"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={offerHeading?.ar}
                    onChange={(e) => {
                        setOfferHeading({
                            ...offerHeading,
                            en: offerHeading.en,
                            ar: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            offerHeading: {
                                en: "",
                                ar: "",
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.offerHeading.ar
                        ? `*${storeErrors.offerHeading.ar}`
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
export default OfferHeaderLine;