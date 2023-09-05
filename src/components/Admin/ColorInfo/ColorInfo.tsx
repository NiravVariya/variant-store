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

function ColorInfo() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [StoreSettings, setStoreSettings] = useState({
        primaryColor: "",
        secondaryColor: "",
    });
    const [storeErrors, setStoreErrors] = useState({
        colors: { primaryColor: "", secondaryColor: "" },
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setStoreSettings({
            primaryColor: reduxData.storeSetData?.primaryColor ?? "",
            secondaryColor: reduxData.storeSetData?.secondaryColor ?? "",
        });
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));
        if (
            StoreSettings.primaryColor == "" ||
            StoreSettings.secondaryColor == ""
        ) {
            setStoreErrors({
                ...storeErrors,
                colors: {
                    primaryColor:
                        StoreSettings.primaryColor == ""
                            ? "Primary color must be required."
                            : "",
                    secondaryColor:
                        StoreSettings.secondaryColor == ""
                            ? "Secondary color must be required."
                            : "",
                },
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    ...StoreSettings,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    ...StoreSettings,
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
            Manage Colors
        </Heading>
        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Primary Color</FormLabel>
                <Input
                    placeholder="Primary Color"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="color"
                    value={StoreSettings.primaryColor}
                    onChange={(e) => {
                        setStoreSettings({
                            ...StoreSettings,
                            primaryColor: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            colors: {
                                primaryColor: "",
                                secondaryColor: storeErrors.colors.secondaryColor,
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.colors.primaryColor
                        ? `*${storeErrors.colors.primaryColor}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Secondary Color</FormLabel>
                <Input
                    placeholder="Secondary Color"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="color"
                    value={StoreSettings.secondaryColor}
                    onChange={(e) => {
                        setStoreSettings({
                            ...StoreSettings,
                            secondaryColor: e.target.value,
                        });
                        setStoreErrors({
                            ...storeErrors,
                            colors: {
                                primaryColor: storeErrors.colors.primaryColor,
                                secondaryColor: "",
                            },
                        });
                    }}
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.colors.secondaryColor
                        ? `*${storeErrors.colors.secondaryColor}`
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

export default ColorInfo;