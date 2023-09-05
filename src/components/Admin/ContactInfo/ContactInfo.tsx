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

function ContactInfo() {
    const [settigDoc, setSettigDoc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [contactInfo, setConatctInfo] = useState({
        email: "",
        phone: "",
        address: { en: "", ar: "" },
    });
    const [storeErrors, setStoreErrors] = useState({
        contact: {
            email: "",
            phone: "",
            address: { en: "", ar: "" },
        }
    });

    const reduxData = useSelector((state: any) => state.icon);

    useEffect(() => {
        setConatctInfo({
            email: reduxData.storeSetData.contactInfo?.email ?? "",
            phone: reduxData.storeSetData.contactInfo?.phone ?? "",
            address: {
                en: reduxData.storeSetData.contactInfo?.address?.en ?? "",
                ar: reduxData.storeSetData.contactInfo?.address?.ar ?? "",
            },
        });
        setSettigDoc(reduxData.storeSetDataRef)
    }, [reduxData])

    const handleSubmitData = async () => {
        const settingStoreRef = doc(collection(db, "storeSetting"));
        if (
            contactInfo.address.en == "" ||
            contactInfo.address.ar == "" ||
            contactInfo.email == "" ||
            contactInfo.phone == ""
        ) {
            setStoreErrors({
                ...storeErrors,
                contact: {
                    address: {
                        en: contactInfo.address.en == "" ? "Address must be required." : "",
                        ar:
                            contactInfo.address.ar == ""
                                ? "Address in Arabic must be required."
                                : "",
                    },
                    email: contactInfo.email == "" ? "Email must be required." : "",
                    phone:
                        contactInfo.phone == "" ? "Phone number must be required." : "",
                },
            });
        } else {
            setIsLoading(true);
            if (!settigDoc) {
                await setDoc(settingStoreRef, {
                    contactInfo: contactInfo,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }).then(() => {
                    toast.success("added successfully");
                    setIsLoading(false);
                });
            } else {
                await updateDoc(settigDoc, {
                    contactInfo: contactInfo,
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
            Manage Contact Info
        </Heading>

        <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={4}
        >
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Conatct Address</FormLabel>
                <Input
                    placeholder="Conatct Address"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={contactInfo.address.en}
                    onChange={(e) => {
                        setConatctInfo({
                            ...contactInfo,
                            address: { en: e.target.value, ar: "" },
                        })
                        setStoreErrors({
                            ...storeErrors,
                            contact: {
                                address: {
                                    en: "",
                                    ar: storeErrors.contact.address.ar,
                                },
                                email: "",
                                phone: ""
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.contact.address.en
                        ? `*${storeErrors.contact.address.en}`
                        : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Conatct Address (Arabic)</FormLabel>
                <Input
                    placeholder="Conatct Address"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={contactInfo.address.ar}
                    onChange={(e) => {
                        setConatctInfo({
                            ...contactInfo,
                            address: { en: contactInfo.address.en, ar: e.target.value },
                        })
                        setStoreErrors({
                            ...storeErrors,
                            contact: {
                                address: {
                                    en: "",
                                    ar: "",
                                },
                                email: "",
                                phone: ""
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.contact.address.ar
                        ? `*${storeErrors.contact.address.ar}`
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
                <FormLabel fontSize={15}>Conatct Email</FormLabel>
                <Input
                    placeholder="Conatct Email"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={contactInfo.email}
                    onChange={(e) => {
                        setConatctInfo({
                            ...contactInfo,
                            email: e.target.value,
                        })
                        setStoreErrors({
                            ...storeErrors,
                            contact: {
                                address: {
                                    en: "",
                                    ar: "",
                                },
                                email: "",
                                phone: ""
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.contact.email ? `*${storeErrors.contact.email}` : ""}
                </FormHelperText>
            </FormControl>
            <FormControl isRequired mb={{ base: 0, md: 5 }}>
                <FormLabel fontSize={15}>Conatct Number</FormLabel>
                <Input
                    placeholder="Conatct Number"
                    _focus={{ borderColor: "grey" }}
                    ms={0.5}
                    width={"95%"}
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => {
                        setConatctInfo({
                            ...contactInfo,
                            phone: e.target.value,
                        })
                        setStoreErrors({
                            ...storeErrors,
                            contact: {
                                address: {
                                    en: "",
                                    ar: "",
                                },
                                email: "",
                                phone: ""
                            },
                        });
                    }
                    }
                />
                <FormHelperText style={{ color: "red" }} mb={5}>
                    {storeErrors.contact.phone ? `*${storeErrors.contact.phone}` : ""}
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

export default ContactInfo;