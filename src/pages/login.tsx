import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { GoogleIcon } from '@/components/SignUpForm/ProviderIcons'
import useTranslation from "@/hooks/useTranslation";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/store";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { HiEye, HiEyeOff } from "react-icons/hi";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const onClickReveal = () => {
        onToggle();
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    };
    const router = useRouter();
    const dispatch = useDispatch();

    type Inputs = {
        email: string;
        password: string;
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required(t("SignupForm.email.requiredMsg"))
            .label("email")
            .email(t("SignupForm.email.validMsg"))
            .matches(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                t("SignupForm.email.validMsg")
            ),
        password: Yup.string()
            .required(t("SignupForm.password.requiredMsg"))
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver<any>(validationSchema),
    });

    const login: SubmitHandler<Inputs> = (values: Inputs) => {
        const auth = getAuth();
        setIsLoading(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user: any = userCredential.user;
                const userDetails: any = { email: user.email, id: user.uid }
                dispatch(setUserDetails(userDetails));
                localStorage.setItem("userId", user.uid);
                toast.success(t("LoginForm.ToastMsg"));
                setIsLoading(false);
                router.push("/");
            })
            .catch((error) => {
                setIsLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorCode.split('/')[1]);
            });
    }

    const signInWithGoogle = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                const docRef = doc(db, "storeUsers", user.uid);
                const userDetail = await getDoc(docRef)
                if (userDetail.exists()) {
                    router.push("/");
                } else {
                    const usid = user.uid;
                    const ref = doc(db, "storeUsers", user.uid);
                    setDoc(ref, {
                        id: usid,
                        email: user.email,
                        name: "",
                    })
                    router.push("/");
                }
                const userDetails: any = { email: user.email, id: user.uid }
                dispatch(setUserDetails(userDetails));
                window.localStorage.setItem("userId", result.user.uid);
                console.log({ credential, token, user });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (<>
        <Container
            maxW="lg"
            py={{ base: "12", md: "24" }}
            px={{ base: "0", sm: "8" }}
        >
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>
                            {t("LoginForm.title")}
                        </Heading>
                        <HStack spacing="1" justify="center">
                            <Text color="muted">{t("LoginForm.DonotHaveAnAccount")}</Text>
                            <Link
                                href={"/signup"}
                                color="primaryColor"
                            >
                                {t("LoginForm.SignupLink")}
                            </Link>
                        </HStack>
                    </Stack>
                </Stack>
                <Box
                    py={{ base: "0", sm: "8" }}
                    px={{ base: "4", sm: "10" }}
                    bg={{ base: "transparent", sm: "bg-surface" }}
                    boxShadow={{ base: "none", sm: "md" }}
                    borderRadius={{ base: "none", sm: "xl" }}
                >
                    <form
                        onSubmit={handleSubmit(login)}
                    >
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel htmlFor="email">
                                        {t("LoginForm.Email")}
                                        <span style={{ color: "red" }}> *</span>
                                    </FormLabel>
                                    <Input id="email"
                                        placeholder={t("LoginForm.EmailInput")}
                                        {...register("email")}
                                    />
                                    <FormErrorMessage>{errors.email && errors.email?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel htmlFor="password">{t("SignupForm.Password")}</FormLabel>
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
                                        <Input id="password"
                                            placeholder={t("SignupForm.PasswordInput")}
                                            {...register("password")}
                                            mb={!!errors.password ? 0 : 3}
                                            type={isOpen ? "text" : "password"}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.password && errors.password?.message}</FormErrorMessage>
                                    <HStack justify="flex-end">
                                        <Link
                                            href={'/forgotpassword'}
                                            color="primaryColor"
                                        >
                                            {t("LoginForm.ForgotPassword")}
                                        </Link>
                                    </HStack>
                                </FormControl>
                            </Stack>
                            <Stack spacing="6">
                                <Button
                                    variant="primary"
                                    className="btn"
                                    type="submit"
                                >
                                    {isLoading ? <Spinner /> : t("LoginForm.LoginButton")}
                                </Button>
                                <Button
                                    variant="primary"
                                    className="btn"
                                    onClick={() => router.push("/")}
                                >
                                    {t("LoginForm.ContinueAsGuest")}
                                </Button>
                                <HStack>
                                    <Divider />
                                    <Text
                                        fontSize="sm"
                                        whiteSpace="nowrap"
                                        color="muted"
                                    >
                                        {t("LoginForm.OrContinueWith")}
                                    </Text>
                                    <Divider />
                                </HStack>
                                <Button variant="secondary"
                                    leftIcon={<GoogleIcon boxSize="5" />}
                                    iconSpacing="3"
                                    onClick={() => signInWithGoogle()}>
                                    {t("LoginForm.SignUpWithGoogle")}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    </>);
};

export default Login;
