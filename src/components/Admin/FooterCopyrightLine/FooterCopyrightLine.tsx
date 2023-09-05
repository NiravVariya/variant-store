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
    onSnapshot,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function FooterCopyrightLine() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [copyRightLine, setCopyRightLine] = useState({
        en: "",
        ar: "",
    });

    const [storeErrors, setStoreErrors] = useState({
        copyRightLine: { en: "", ar: "" },
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setCopyRightLine({
            en: reduxData.storeSetData.copyRightLine?.en ?? "",
            ar: reduxData.storeSetData.copyRightLine?.ar ?? "",
        });
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));

        if (copyRightLine.en == "" || copyRightLine.ar == "") {
            setStoreErrors({
                ...storeErrors,
                copyRightLine: {
                    en: copyRightLine.en == "" ? "Copy right line must be required." : "",
                    ar:
                        copyRightLine.ar == ""
                            ? "Copy right line in Arabic must be required."
                            : "",
                },
            });
        }
        else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    copyRightLine: copyRightLine,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    copyRightLine: copyRightLine,
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
            Manage Footer Copyright Line
        </Heading>

        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Copy right Line</FormLabel>
                <Input
                    placeholder="Copy right Line"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={copyRightLine.en}
                    onChange={(e) => {
                        setCopyRightLine({
                            ...copyRightLine,
                            en: e.target.value,
                            ar: "",
                        });
                        setStoreErrors({
                            ...storeErrors,
                            copyRightLine: {
                                en: "",
                                ar: storeErrors.copyRightLine.ar,
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.copyRightLine.en
                        ? `*${storeErrors.copyRightLine.en}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Copy right Line (Arabic)</FormLabel>
                <Input
                    placeholder="Copy right Line"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={copyRightLine.ar}
                    onChange={(e) => {
                        setCopyRightLine({
                            ...copyRightLine,
                            en: copyRightLine.en,
                            ar: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            copyRightLine: {
                                en: storeErrors.copyRightLine.en,
                                ar: "",
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.copyRightLine.ar
                        ? `*${storeErrors.copyRightLine.ar}`
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
export default FooterCopyrightLine;