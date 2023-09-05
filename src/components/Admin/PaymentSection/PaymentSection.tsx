import { db } from "@/firebase/client";
import { Button, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Input, Select, Spinner, Text } from "@chakra-ui/react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function PaymentSection() {

    const Currency = [
        "None", "Paypal", "Stripe"
    ]
    const [docId, setDocId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [paymentDoc, setPaymentDoc] = useState();
    const [paymentDocId, setPaymentDocId] = useState();
    const [paymentInfo, setPaymentInfo] = useState({
        selectedPayment: "",
        paymentKey: ""
    });
    const [paymentInfoError, setPaymentInfoError] = useState({
        selectedPayment: "",
        paymentKey: ""
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
            const aboutRef = collection(db, "storeSetting", docId, "paymentDetails");
            onSnapshot(aboutRef, (settingSnap: any) => {
                settingSnap.docs &&
                    settingSnap.docs.map((docvalue: any) => {
                        if (docvalue) {
                            const dataref: any = doc(
                                db,
                                "storeSetting",
                                docId,
                                "paymentDetails",
                                docvalue.id
                            );
                            setPaymentDocId(dataref.id);
                            setPaymentDoc(dataref);
                            setPaymentInfo({
                                selectedPayment: docvalue.data().selectedPayment,
                                paymentKey: docvalue.data().paymentKey
                            });
                        }
                    });
            });
        }
    }, [docId]);

    const handleCurrencyInfo = () => {
        if (paymentInfo.selectedPayment == "None") {
            setIsLoading(true);
            if (paymentDoc) {
                const settingStoreRef = doc(db, "storeSetting", docId, "paymentDetails", paymentDocId);
                deleteDoc(settingStoreRef);
                toast.success("added successfully");
                setIsLoading(false);
            }
            else {
                toast.success("added successfully");
                setIsLoading(false);
            }
        } else {
            if (paymentInfo.selectedPayment == "") {
                setPaymentInfoError({
                    ...paymentInfoError,
                    selectedPayment: paymentInfo.selectedPayment == "" ? "Select Payment Option" : "",
                });
            }
            else if (paymentInfo.paymentKey == "") {
                setPaymentInfoError({
                    ...paymentInfoError,
                    paymentKey: paymentInfo.paymentKey == "" ? "Payment Key Is Required" : "",
                });
            }
            else {
                setIsLoading(true);
                if (!paymentDoc) {
                    const settingStoreRef = doc(
                        collection(db, "storeSetting", docId, "paymentDetails")
                    );
                    setDoc(settingStoreRef, {
                        ...paymentInfo,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    }).then(() => {
                        toast.success("added successfully");
                        setIsLoading(false);
                    });
                }
                else {
                    updateDoc(paymentDoc, {
                        ...paymentInfo,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    }).then(() => {
                        toast.success("Updated successfully");
                        setIsLoading(false);
                    });
                }
            }
        }
    };

    return (
        <div>
            <Heading size={"sm"} mb={5}>
                Manage Payment
            </Heading>
            <Grid
                templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
                gap={6}
                mb={4}
            >
                <GridItem>
                    <FormControl isRequired>
                        <FormLabel fontSize={15}>Select Payment</FormLabel>
                        <Select
                            size="lg"
                            ms={0.5}
                            width={"95%"}
                            value={paymentInfo.selectedPayment}
                            onChange={(e) => {
                                setPaymentInfo({
                                    ...paymentInfo,
                                    selectedPayment: e.target.value,
                                    paymentKey: "",
                                });
                                setPaymentInfoError({
                                    ...paymentInfoError,
                                    selectedPayment: "",
                                });
                            }}
                        >
                            <option selected disabled value="">
                                Select Payment Option
                            </option>
                            {Currency &&
                                Currency.map((value, index) => (
                                    <option value={value} key={index}>
                                        {value}
                                    </option>
                                ))}
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                            {paymentInfoError.selectedPayment ? `${paymentInfoError.selectedPayment}` : ""}
                        </FormHelperText>
                    </FormControl>
                </GridItem>
                {
                    paymentInfo.selectedPayment == "None" ? null : (
                        <>
                            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                                <FormLabel fontSize={15}>
                                    {
                                        paymentInfo.selectedPayment == "Stripe" ? "Add Stripe Secret Key"
                                            : paymentInfo.selectedPayment == "Paypal" ? "Add Paypal Client ID"
                                                : "Add Payment Key"
                                    }
                                </FormLabel>
                                <Input
                                    placeholder="Add Payment Key"
                                    _focus={{ borderColor: "grey" }}
                                    ms={0.5}
                                    width={"95%"}
                                    type="text"
                                    value={paymentInfo.paymentKey}
                                    onChange={(e) => {
                                        setPaymentInfo({
                                            ...paymentInfo,
                                            paymentKey: e.target.value,
                                        });
                                        setPaymentInfoError({
                                            ...paymentInfoError,
                                            paymentKey: "",
                                        });
                                    }}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                    {paymentInfoError.paymentKey ? `${paymentInfoError.paymentKey}` : ""}
                                </FormHelperText>
                            </FormControl>
                        </>
                    )
                }
            </Grid>
            <Button
                variant="primary"
                type="submit"
                mb={7}
                onClick={() => handleCurrencyInfo()}
            >
                {isLoading ? (
                    <Spinner />
                ) : paymentDoc !== undefined ? (
                    "Update"
                ) : (
                    "Save"
                )}
            </Button>
        </div>
    );
}

export default PaymentSection;
