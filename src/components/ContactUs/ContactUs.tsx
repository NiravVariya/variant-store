import { Box, HStack, Stack, Text, Icon, Flex, Heading, FormControl, FormLabel, Input, Button, FormHelperText, FormErrorMessage } from "@chakra-ui/react";
import React, { useState } from "react";
import { HiOutlineChat, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import useTranslation from "@/hooks/useTranslation";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [comments, setComments] = useState("");
    const { t } = useTranslation();

    const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {

        const placedOrder = await addDoc(collection(db, "ContactUS"), {
            name: name,
            email: email,
            comments: comments,
            ContactDate: serverTimestamp(),
        }).then(() => {
            setName("");
            setEmail("")
            setComments("")
            toast.success(t("ContactUs.ToastMsg"));
        })
    }


    type Inputs = {
        name: string;
        email: string;
        comments: string;
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required(t("ContactUs.name.requiredMsg"))
            .min(4, t("ContactUs.name.minMsg"))
            .label(t("ContactUs.name.validMsg"))
            .matches(
                /[abcdefghijklmnopqrstuvwxyz]+/,
                t("ContactUs.name.validMsg")
            ),
        email: Yup.string()
            .required(t("ContactUs.email.requiredMsg"))
            .label("email")
            .email(t("ContactUs.email.validMsg"))
            .matches(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                t("ContactUs.email.validMsg")
            ),
        comments: Yup.string()
            .required(t("ContactUs.CommentsValidationError"))
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver<any>(validationSchema),
    });

    const reduxData = useSelector((state: any) => state.icon);

    return (
        <Box
            maxW={{ base: "3xl", lg: "7xl" }}
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "150" }}
        >
            <Flex justifyContent={"space-between"} direction={{ base: 'column', md: 'row' }}>
                <Stack
                    spacing="8"
                    fontWeight="semibold"
                    flexDirection={"column"}
                >
                    <Flex>
                        <Stack>
                            <Icon as={HiOutlineChat} boxSize="30" />
                        </Stack>
                        <Stack paddingLeft={2}>
                            <Text fontSize={"x-large"}>{t("ContactUs.ChattoUs")}</Text>
                            <Text color={"rgba(22, 22, 22, 0.7)"}>{t("ContactUs.OurFriendly")}</Text>
                            <Text display={reduxData.storeSetData.contactInfo ? "block" : "none"}>
                                {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.email}
                            </Text>
                        </Stack>
                    </Flex>
                    <Flex>
                        <Stack>
                            <Icon as={GrLocation} boxSize="30" />
                        </Stack>
                        <Stack paddingLeft={2}>
                            <Text fontSize={"x-large"}>{t("ContactUs.VisitUs")}</Text>
                            <Text color={"rgba(22, 22, 22, 0.7)"}>{t("ContactUs.Comesay")}</Text>
                            <Text display={reduxData.storeSetData.contactInfo ? "block" : "none"}>
                                {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.address.en}
                            </Text>
                        </Stack>
                    </Flex>
                    <Flex>
                        <Stack>
                            <Icon as={HiOutlinePhone} boxSize="30" />
                        </Stack>
                        <Stack paddingLeft={2}>
                            <Text fontSize={"x-large"}>{t("ContactUs.CallUs")}</Text>
                            <Text color={"rgba(22, 22, 22, 0.7)"}>{t("ContactUs.MonFri")}</Text>
                            <Text display={reduxData.storeSetData.contactInfo ? "block" : "none"}>
                                {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.phone}
                            </Text>
                        </Stack>
                    </Flex>
                </Stack>
                <Stack spacing={{ base: '6', md: '7' }}>
                    <form
                        id="create-store-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Heading size="md">{t("ContactUs.title")}</Heading>
                        <Text mb={3}>{t("ContactUs.des")}</Text>
                        <Stack spacing={{ base: '2', md: '10' }}>
                            <FormControl id="name" isInvalid={!!errors.name}>
                                <FormLabel>{t("ContactUs.FullName")}</FormLabel>
                                <Input
                                    name="name"
                                    placeholder={t("ContactUs.FullNameInput")}
                                    value={name}
                                    {...register("name")}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                                <FormErrorMessage>{errors.name && errors.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="email" isInvalid={!!errors.email}>
                                <FormLabel htmlFor="email">{t("ContactUs.EmailAddress")}</FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder={t("ContactUs.EmailAddress")}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                <FormErrorMessage>{errors.email && errors.email?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl id="street" isInvalid={!!errors.comments}>
                                <FormLabel>{t("ContactUs.Comments")}</FormLabel>
                                <Input
                                    name="name"
                                    height={"100px"}
                                    {...register("comments")}
                                    placeholder={t("ContactUs.CommentsInput")}
                                    value={comments}
                                    onChange={(e) => {
                                        setComments(e.target.value);
                                    }}
                                />
                                <FormErrorMessage>{errors.comments && errors.comments?.message}</FormErrorMessage>
                            </FormControl>
                            <Stack>
                                <Button
                                    bg={"primaryColor"}
                                    color={"#fff"}
                                    marginTop={5}
                                    type="submit"
                                >
                                    {t("ContactUs.Submit")}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Stack>
            </Flex>
        </Box>
    );
};

export default ContactUs;