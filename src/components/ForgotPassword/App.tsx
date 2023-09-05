import useTranslation from '@/hooks/useTranslation'
import { Box, Button, Container, Divider, FormControl, FormErrorMessage, Heading, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { fetchSignInMethodsForEmail, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const auth = getAuth();
  const { t } = useTranslation();

  const forgotpassword = () => {
    if (email === "") {
      setErrorEmailMessage(t("ForgotPassword.EmailValidation"));
    }
    if (email) {
      setIsLoading(true);
      fetchSignInMethodsForEmail(auth, email)
        .then((method) => {
          if (method.length) {
            sendPasswordResetEmail(auth, email).then(() => {
              toast.success(t("ForgotPassword.ToastMsg"));
              auth.signOut().then(() => {
                router.push("/login");
                window.localStorage.removeItem("userId");
                setIsLoading(false);
              })
              setErrorEmailMessage("");
            });
          }
        })
    }
  }

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrorEmailMessage('Please enter a valid email address');
    } else {
      setErrorEmailMessage('');
    }
  };

  return (
    <Box
      py={{ base: '12', md: '24' }}>
      <Container
        maxW="md"
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={{ base: 'transparent', sm: 'bg-surface' }}
        boxShadow={{ base: 'none', sm: 'xl' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            {/* <Logo /> */}
            <Stack spacing="3" textAlign="center">
              <Heading size="xs">{t("ChangePassword.title")}</Heading>
              <Text>{t("ChangePassword.EnterYourEmailHere")}</Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="4">
              <FormControl
                isInvalid={(errorEmailMessage) && true}
              >
                <Input placeholder={t("ChangePassword.EnterYourEmailInput")} value={email}
                  onChange={handleEmailChange} />
                {errorEmailMessage && (
                  <FormErrorMessage>{errorEmailMessage}</FormErrorMessage>
                )}
              </FormControl>
              <Button className="btn" variant="primary" onClick={() => forgotpassword()}>{isLoading ? <Spinner /> : t("ChangePassword.Submit")}</Button>
            </Stack>
          </Stack>
          <Stack spacing="0.5" align="center">
            <Text fontSize="sm" color="muted">
              {t("ChangePassword.HavingTrouble")}
            </Text>
            <Button variant="link" color="primaryColor" size="sm" onClick={() => router.push("/contactus")}>
              {t("ChangePassword.ContactUS")}
            </Button>
          </Stack>
          <Text fontSize="xs" color="subtle" textAlign="center">
            {t("ChangePassword.ByContinuing")}
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}
