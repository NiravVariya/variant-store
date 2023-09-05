import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Stack,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useUserContext } from "../../context/UserContext";

import Loader from "@/components/Common/Loader";
import { Logo } from "@/components/Layout/Logo";
import { loginWithEmail } from "@/services/auth_service";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { HiEye, HiEyeOff } from "react-icons/hi";

type Inputs = {
  email: string;
  password: string;
};

const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function Login() {
  const router = useRouter();

  const { user, loading } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
    }
};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver<any>(schema),
  });

  const onLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    loginWithEmail(
      data,
      (res: any) => {
        let userID: any = res.user.uid
        let q = query(collection(db, "storeUsers"), where("id", "==", userID));
        onSnapshot(q, (querySnapshot: any) => {
          if (querySnapshot?.docs[0]?.data().isAdmin == true) {
            toast.success("Login successful");
            router.push("/admin/dashboard");
            window.localStorage.setItem("isAdmin", "true");
            window.localStorage.setItem("AdminUserID", userID);
          } else {
            toast.error("You are not Admin");
            setIsSubmitting(false);
          }
        });
      },
      (error: any) => {
        if (error.code == "auth/wrong-password") {
          toast.error("Please Enter Valid Password...");
        } else if (error.code == "auth/user-not-found") {
          toast.error("User Not Found Please Enter Valid Email");
        } else {
          toast.error(error.message);
        }

        setIsSubmitting(false);
      }
    );
  };

  if (loading) {
    return <Loader />;
  }

  // if (user && !loading) {
  //   router.push("/");
  // }

  return (
    <>
      <Container maxW="md" py={{ base: "12", md: "24" }}>
        <Stack spacing="8">
          <Center>
            <Logo width={230} />
          </Center>
          <Stack spacing="6" align="center">
            <Heading size={"sm"}>Log in to your account</Heading>
          </Stack>
          <Stack spacing="6">
            <form onSubmit={handleSubmit(onLoginSubmit)}>
              <Stack spacing="4">
                <Input
                  placeholder="Enter your email"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                />
                <p style={{ marginTop: 0, color: "#ff0000" }}>
                  {errors.email?.message}
                </p>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="link"
                      aria-label={
                        isOpen ? "Mask password" : "Reveal password"
                      }
                      icon={isOpen ? <HiEyeOff /> : <HiEye />}
                      onClick={onClickReveal}
                    />
                  </InputRightElement>
                  <Input
                    placeholder="Enter your password"
                    name="password"
                    autoComplete="current-password"
                    {...register("password")}
                    type={isOpen ? "text" : "password"}
                  />
                </InputGroup>
                <p style={{ marginTop: 0, color: "#ff0000" }}>
                  {errors.password?.message}
                </p>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Sign in"
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
