import {
    Box,
    Button,
    Container,
    Spinner,
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { auth } from "@/firebase/client";
import { useRouter } from "next/router";
import { App } from "@/components/NavWithCenteredLogo/App";
import { TabsWithLine } from "@/components/TabsWithLine/App";
import { Footer } from "@/components/Footer/Footer";
import { toast } from "react-hot-toast";
import useTranslation from "@/hooks/useTranslation";
import WithAuth from "../auth/withAuth";
import USER_TYPE from "../auth/constans";
import { useState } from "react";

const Logout = () => {
    const router = useRouter()
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const logOut = () => {
        setIsLoading(true)
        auth.signOut().then(() => {
            router.push("/");
            window.localStorage.removeItem("userId");
            setIsLoading(false)
            toast.success(t("LogOut.ToastMsg"));
        }).catch((error) => {
            setIsLoading(false)
            console.log("error==============> ", error)
        });
    }

    return (
        <>
            <App />
            <TabsWithLine />
            <Container maxW="3xl">
                <Box
                    bg="bg-surface"
                    borderRadius="lg"
                    p={{ base: "4", md: "6" }}
                    marginBottom={"11.8rem"}
                >
                    <Stack spacing="5" divider={<StackDivider />}>
                        <Stack
                            justify="space-between"
                            direction={{ base: "column", sm: "row" }}
                            spacing="5"
                        >
                            <Stack spacing="1">
                                <Text fontSize="lg" fontWeight="medium">
                                    {t("Logout.title")}
                                </Text>
                                <Text fontSize="sm" color="muted">
                                    {t("Logout.LogoutFrom")}
                                </Text>
                            </Stack>
                            <Button className="btn" variant="primary" onClick={() => logOut()}>
                                {isLoading ? <Spinner /> : t("Logout.Logout")}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default WithAuth(Logout, USER_TYPE.shouldAuthenticated);