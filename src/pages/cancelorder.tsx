import {
    Box,
    Heading,
    Stack,
} from "@chakra-ui/react";
import React from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { Footer } from "@/components/Footer/Footer";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";
import useTranslation from "@/hooks/useTranslation";

const Cancelorder = () => {
    const { t } = useTranslation();

    return (
        <>
            <App />
            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: "4", md: "8", lg: "12" }}
                py={{ base: "6", md: "8", lg: "12" }}
                marginTop={"7rem"}
                marginBottom={"8rem"}
            >
                <Stack spacing="3" paddingBottom={"1rem"}>
                    <Heading size="md" fontWeight="normal">
                        {t("CancelOrder.Title")}
                    </Heading>
                </Stack>
            </Box >
            <Footer />
        </>);
};

export default WithAuth(Cancelorder, USER_TYPE.shouldAuthenticated);
