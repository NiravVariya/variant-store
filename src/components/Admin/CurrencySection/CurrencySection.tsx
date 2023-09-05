import { db } from "@/firebase/client";
import { Button, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Spinner, Text } from "@chakra-ui/react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function CurrencySection() {

    const Currency = [
        "AED", "SAR", "OMR", "KWD"
    ]
    const [docId, setDocId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currencyDoc, setCurrencyDoc] = useState();
    const [currencyInfo, setCurrencyInfo] = useState({
        mainCurrency: "",
        // secondCurrency: "",
    });
    const [currencyInfoError, setCurrencyInfoError] = useState({
        mainCurrency: "",
        // secondCurrency: "",
    });

    useEffect(() => {
        const settingStoreRef = collection(db, "storeSetting");
        onSnapshot(settingStoreRef, (settingSnap) => {
            settingSnap.docs.map((value) => {
                const dataref: any = doc(db, "storeSetting", value.id);
                setDocId(dataref.id);
            });
        });
    }, []);

    useEffect(() => {
        if (docId) {
            const aboutRef = collection(db, "storeSetting", docId, "Currencies");
            onSnapshot(aboutRef, (settingSnap: any) => {
                settingSnap.docs &&
                    settingSnap.docs.map((docvalue: any) => {
                        if (docvalue) {
                            const dataref: any = doc(
                                db,
                                "storeSetting",
                                docId,
                                "Currencies",
                                docvalue.id
                            );
                            setCurrencyDoc(dataref);
                            setCurrencyInfo({
                                mainCurrency: docvalue.data().mainCurrency,
                                // secondCurrency: docvalue.data().secondCurrency
                            });
                        }
                    });
            });
        }
    }, [docId]);

    const handleCurrencyInfo = () => {
        if (currencyInfo.mainCurrency == "") {
            setCurrencyInfoError({
                ...currencyInfoError,
                mainCurrency: currencyInfo.mainCurrency == "" ? "Main currency be requied" : "",
            });
        }
        // else if (currencyInfo.secondCurrency == "") {
        //     setCurrencyInfoError({
        //         ...currencyInfoError,
        //         secondCurrency: currencyInfo.secondCurrency == "" ? "Second currency be requied" : "",
        //     });
        // } 
        else {
            setIsLoading(true);
            if (!currencyDoc) {
                const settingStoreRef = doc(
                    collection(db, "storeSetting", docId, "Currencies")
                );
                setDoc(settingStoreRef, {
                    ...currencyInfo,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            }
            else {
                updateDoc(currencyDoc, {
                    ...currencyInfo,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("Updated successfully");
                    setIsLoading(false);
                });
            }
        }
    };


    return (
        <div>
            <Heading size={"sm"} mb={5}>
                Manage Currencies
            </Heading>
            <Grid
                templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
                gap={6}
                mb={4}
            >
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel fontSize={15}>Select Second Currency</FormLabel>
                        <Select
                            size="lg"
                            ms={0.5}
                            width={"95%"}
                            // borderColor={productError.Category ? "red" : ""}
                            value={currencyInfo.mainCurrency}
                            onChange={(e) => {
                                setCurrencyInfo({
                                    ...currencyInfo,
                                    mainCurrency: e.target.value,
                                });
                                setCurrencyInfoError({
                                    ...currencyInfoError,
                                    mainCurrency: "",
                                });
                            }}
                        >
                            <option selected disabled value="">
                                Select Second Currency
                            </option>
                            {Currency &&
                                Currency.map((value, index) => (
                                    <option value={value} key={index}>
                                        {value}
                                    </option>
                                ))}
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                            {currencyInfoError.mainCurrency ? `${currencyInfoError.mainCurrency}` : ""}
                        </FormHelperText>
                    </FormControl>
                </GridItem>
                {/* <GridItem>
                    <FormControl isRequired>
                        <FormLabel fontSize={15}>Select Second Currency</FormLabel>
                        <Select
                            size="lg"
                            ms={0.5}
                            width={"95%"}
                            // borderColor={productError.Category ? "red" : ""}
                            value={currencyInfo.secondCurrency}
                            onChange={(e) => {
                                setCurrencyInfo({
                                    ...currencyInfo,
                                    secondCurrency: e.target.value,
                                });
                                setCurrencyInfoError({
                                    ...currencyInfoError,
                                    secondCurrency: "",
                                });
                            }}
                        >
                            <option selected disabled value="">
                                Select second Currency
                            </option>
                            {Currency &&
                                Currency.map((value, index) => (
                                    <option value={value} key={index}>
                                        {value}
                                    </option>
                                ))}
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                            {currencyInfoError.secondCurrency ? `${currencyInfoError.secondCurrency}` : ""}
                        </FormHelperText>
                    </FormControl>
                </GridItem> */}
                {/* <GridItem>
                    <FormControl isRequired>
                        <FormLabel fontSize={15}>Select Third Currency</FormLabel>
                        <Select
                            size="lg"
                            ms={0.5}
                            width={"95%"}
                            // borderColor={productError.Category ? "red" : ""}
                            value={currencyInfo.thirdCurrency}
                            onChange={(e) => {
                                setCurrencyInfo({
                                    ...currencyInfo,
                                    thirdCurrency: e.target.value,
                                });
                                setCurrencyInfoError({
                                    ...currencyInfoError,
                                    thirdCurrency: "",
                                });
                            }}
                        >
                            <option selected disabled value="">
                                Select Third Currency
                            </option>
                            {Currency &&
                                Currency.map((value, index) => (
                                    <option value={value} key={index}>
                                        {value}
                                    </option>
                                ))}
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                            {currencyInfoError.thirdCurrency ? `${currencyInfoError.thirdCurrency}` : ""}
                        </FormHelperText>
                    </FormControl>
                </GridItem> */}
            </Grid>
            <Button
                variant="primary"
                type="submit"
                mb={7}
                onClick={() => handleCurrencyInfo()}
            >
                {isLoading ? (
                    <Spinner />
                ) : currencyDoc !== undefined ? (
                    "Update"
                ) : (
                    "Save"
                )}
            </Button>
        </div>
    );
}

export default CurrencySection;
