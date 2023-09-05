import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'
import Dropzone from '../Common/Dropzone';
import useImage from "@/hooks/useImage";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { getAuth, updateEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import useTranslation from '@/hooks/useTranslation';

export const Profile = () => {
  const [fileInputRef, imageUrl, _, handleFileUpload] = useImage();
  const { user } = useUserContext();

  const auth = getAuth();
  const [userDocID, setUserDocID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsFile, setImageAsFile] = useState<any>('')
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    const Uid = localStorage.getItem("userId");
    const fetchStoreDetail = async () => {
      const docRef = collection(db, "storeUsers");
      onSnapshot(docRef, (userSnapshot) => {
        userSnapshot.docs.map((item: any) => {
          if (item.data().id === Uid) {
            setUserData({ ...item.data(), itemID: item.id })
            setUserDocID(item.id)
          }
        });
      });
    };
    fetchStoreDetail();
  }, [imageUrl]);

  const updateData = async (props: string) => {
    setIsLoading(true);
    const updatePLAN = doc(db, "storeUsers", props);
    await updateDoc(updatePLAN, { ...userData, image: imageUrl }).then(() => {
      toast.success(t("profile.ToastMsg"))
      setImageAsFile('');
      setIsLoading(false);
    });
    updateEmail(auth.currentUser, userData.email).then(() => {
      console.log("change your email")
    }).catch((error) => {
      setIsLoading(false);
      console.log("error", error)
    });
  }

  return (
    <Container py={{ base: '4', md: '8' }}>
      <Stack
        spacing="5"
        pe={{ base: 'auto', md: 40 }}
      >
        <Stack
          spacing="4"
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
        >
          <Box>
            <Text fontSize="lg" fontWeight="medium">
              {t("Profile.YourProfile")}
            </Text>
            <Text color="muted" fontSize="sm">
              {t("Profile.TellOthersWhoYouAre")}
            </Text>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing="5" divider={<StackDivider />}>
          <FormControl id="name">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: '1.5', md: '8' }}
              justify="space-between"
            >
              <FormLabel variant="inline">
                {t("Profile.Name")}
              </FormLabel>
              <Input
                type="text"
                placeholder={t("SignupForm.NameInput")}
                maxW={{ md: '3xl' }}
                value={userData.name ? userData.name : ""}
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value })
                }} />
            </Stack>
          </FormControl>
          <FormControl id="email">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: '1.5', md: '8' }}
              justify="space-between"
            >
              <FormLabel variant="inline">
                {t("Profile.Email")}
              </FormLabel>
              <Input
                type="email"
                placeholder={t("SignupForm.EmailInput")}
                maxW={{ md: '3xl' }}
                value={userData.email ? userData.email : ""}
                onChange={e => {
                  setUserData({ ...userData, email: e.target.value })
                }} />
            </Stack>
          </FormControl>
          <FormControl id="picture">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: '1.5', md: '8' }}
              justify="space-between"
            >
              <FormLabel variant="inline">
                {t("Profile.Photo")}
              </FormLabel>
              <Stack
                spacing={{ base: '3', md: '5' }}
                direction={{ base: 'column', sm: 'row' }}
                width="full"
                maxW={{ md: '3xl' }}
              >
                <Avatar
                  size="lg"
                  name="Christoph Winston"
                  src={imageUrl ? imageUrl : (userData.image || "https://tinyurl.com/yhkm2ek8")}
                />
                <Dropzone
                  path={`users/${user?.uid}/uploads`}
                  fileInputRef={fileInputRef}
                  onUpload={handleFileUpload}
                  uploadedImage={imageUrl}
                  uid={user?.uid}
                />
              </Stack>
            </Stack>
          </FormControl>
          {/* <FormControl id="bio">
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <Box>
                    <FormLabel variant="inline">Bio</FormLabel>
                    <FormHelperText mt="0" color="muted">
                      Write a short introduction about you
                    </FormHelperText>
                  </Box>
                  <Textarea maxW={{ md: '3xl' }} rows={5} resize="none" />
                </Stack>
              </FormControl> */}
          <Flex direction="row-reverse">
            <Button
              className="btn"
              variant="primary"
              type='submit'
              onClick={() => updateData(userDocID)}
            >
              {isLoading ? <Spinner /> : t("Profile.Save")}
            </Button>
          </Flex>
        </Stack>
      </Stack>
    </Container>
  )
}

