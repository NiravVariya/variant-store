import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormHelperText,
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
} from '@chakra-ui/react'
//   import { Logo } from './Logo'
import { GoogleIcon } from '@/components/SignUpForm/ProviderIcons'
import Link from 'next/link';
import { useState, useRef } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/router';
import { db } from '@/firebase/client';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { toast } from "react-hot-toast";
import useTranslation from '@/hooks/useTranslation';
import { HiEye, HiEyeOff } from "react-icons/hi";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

const SignUP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { t } = useTranslation();
    const onClickReveal = () => {
        onToggle();
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    };

    type Inputs = {
        name: string;
        email: string;
        password: string;
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required(t("SignupForm.name.requiredMsg"))
            .min(4, t("SignupForm.name.minMsg"))
            .label(t("SignupForm.name.validMsg"))
            .matches(
                /[abcdefghijklmnopqrstuvwxyz]+/,
                t("SignupForm.name.validMsg")
            ),
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
            .min(6, t("SignupForm.password.minMsg"))
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver<any>(validationSchema),
    });

    const auth = getAuth();
    const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {
        setIsLoading(true);

        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("user=======>", user)
                if (user) {
                    const usid = user.uid;
                    const ref = collection(db, "storeUsers");
                    addDoc(ref, {
                        id: usid,
                        email: values.email,
                        name: values.name,
                    })
                }
                localStorage.setItem("userId", user.uid);
                toast.success(t("SignupForm.ToastMsg"));
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
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("result=====>", result.user.uid);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                if (user) {
                    const usid = user.uid;
                    const ref = doc(db, "storeUsers", user.uid);
                    setDoc(ref, {
                        id: usid,
                        email: user.email,
                        name: "",
                    })
                }
                router.push("/");
                window.localStorage.setItem("userId", result.user.uid);
                console.log({ credential, token, user });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <Container maxW="md" py={{ base: '12', md: '24' }}>
            <Stack spacing="8">
                <Stack spacing="6" align="center">
                    {/* <Logo /> */}
                    <Stack spacing="3" textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>{t("SignupForm.title")}</Heading>
                        <Text color="muted">{t("SignupForm.des")}</Text>
                    </Stack>
                </Stack>
                <Stack spacing="6">
                    <form
                        id="create-store-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Stack spacing="5">
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel htmlFor="name">{t("SignupForm.Name")}</FormLabel>
                                <Input id="name" type="text"
                                    {...register("name")}
                                    mb={!!errors.name ? 0 : 3}
                                    placeholder={t("SignupForm.NameInput")}
                                />
                                <FormErrorMessage>{errors.name && errors.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel htmlFor="email">{t("SignupForm.Email")}</FormLabel>
                                <Input id="email"
                                    placeholder={t("SignupForm.EmailInput")}
                                    {...register("email")}
                                    mb={!!errors.email ? 0 : 3}
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
                                <FormHelperText color="muted" mb={3}>{t("SignupForm.PasswordValidation")}</FormHelperText>
                            </FormControl>
                        </Stack>
                        <Stack spacing="4">
                            <Button
                                variant="primary"
                                className='btn'
                                type="submit"
                            >
                                {isLoading ? <Spinner /> : t("SignupForm.CreateAccount")}
                            </Button>
                            <Button
                                variant="secondary"
                                leftIcon={<GoogleIcon boxSize="5" />}
                                iconSpacing="3"
                                onClick={() => signInWithGoogle()}
                            >
                                {t("SignupForm.SignUpWithGoogle")}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
                <HStack justify="center" spacing="1">
                    <Text fontSize="sm" color="muted">
                        {t("SignupForm.AlreadyHaveAnAccount")}
                    </Text>
                    <Link href={"/login"} color="primaryColor">
                        {t("SignupForm.LoginLink")}
                    </Link>
                </HStack>
            </Stack >
        </Container >
    )
}
export default SignUP;
