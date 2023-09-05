import { signOut } from "@/services/auth_service";
import {
  Box,
  Button,
  Container,
  Stack,
  StackDivider,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMoon, FiSun } from "react-icons/fi";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEffect } from "react";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";

export const Settings = () => {
  const router = useRouter();
  // useEffect(() => {
  //   const adminAuth = localStorage.getItem("isAdmin");
  //   adminAuth ? null : router.push("/auth/login");
  // }, []);

  const { toggleColorMode } = useColorMode();
  const ToggleIcon = useColorModeValue(FiMoon, FiSun);
  return (
    <>
      <Container maxW="3xl" pt={10}>
        <Box
          bg="bg-surface"
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
        >
          <Stack spacing="5" divider={<StackDivider />}>
            <Stack
              justify="space-between"
              direction={{ base: "column", sm: "row" }}
              spacing="5"
            >
              <Stack spacing="1">
                <Text fontSize="lg" fontWeight="medium">
                  Edit Profile
                </Text>
              </Stack>
              <Link href={"/admin/profile"} passHref legacyBehavior>
                <Button variant="secondary">Edit</Button>
              </Link>
            </Stack>
            <Stack
              justify="space-between"
              direction={{ base: "column", sm: "row" }}
              spacing="5"
            >
              <Stack spacing="1">
                <Text fontSize="lg" fontWeight="medium">
                  Logout
                </Text>
                <Text fontSize="sm" color="muted">
                  Logout from the dashboard
                </Text>
              </Stack>
              <Button
                variant="primary"
                onClick={() => {
                  signOut();
                  toast.success("Logout Successfully");
                  localStorage.removeItem("isAdmin");
                  setTimeout(() => {
                    router.push("/auth/login");
                  }, 2000);
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default WithAuth(Settings, USER_TYPE.Admin);

