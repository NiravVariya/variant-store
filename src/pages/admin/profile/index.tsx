import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Dropzone from "@/components/Common/Dropzone";
import { useUserContext } from "@/context/UserContext";
import useImage from "@/hooks/useImage";
import { updateUser } from "@/services/user_service";
import { FormUser } from "@/types/user";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { query, collection, updateDoc, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import WithAuth from "../../../auth/withAuth";
import USER_TYPE from "../../../auth/constans";

const schema = Yup.object().shape({
  display_name: Yup.string().required().label("Full name"),
});

const UserProfile = () => {
  const [fileInputRef, imageUrl, _, handleFileUpload] = useImage();
  const [loading, setLoading] = useState(false);
  const [profileData, setprofileData] = useState({
    name: "",
    image: ""
  });
  const { user } = useUserContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormUser>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      display_name: user?.display_name,
    },
  });

  useEffect(() => {
    const userID = localStorage.getItem("AdminUserID");
    let q: any = query(collection(db, "storeUsers"), where("id", "==", userID));
    onSnapshot(q, async (querySnapshot: any) => {
      let idRef: string = querySnapshot?.docs[0]?.id
      const newRef = doc(db, "storeUsers", idRef);
      const docSnap = await getDoc(newRef);
      if (docSnap.exists()) {
        const docData: any = docSnap.data();
        setprofileData(docData);
        setValue("display_name", docData.name)
        setValue("photo_url",docData.image)
      }
    })
  }, [])

  const onSubmit: SubmitHandler<FormUser> = async (data) => {

    try {
      setLoading(true);
      const userID = localStorage.getItem("AdminUserID");
      if (imageUrl) data.photo_url = imageUrl;
      let q: any = query(collection(db, "storeUsers"), where("id", "==", userID));
      onSnapshot(q, async (querySnapshot: any) => {
        let idRef: string = querySnapshot?.docs[0]?.id
        const newRef = doc(db, "storeUsers", idRef);
        await updateDoc(newRef, {
          name: getValues("display_name"),
          image: getValues("photo_url")
        })
      })
      toast.success("Profile Information Updated");
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
    console.log("user===================>", user)
  }, [])


  return (
    <>
      <Container py={{ base: "4", md: "8" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="5">
            <Stack
              spacing="4"
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
            >
              <Box>
                <Text fontSize="lg" fontWeight="medium">
                  Your Profile
                </Text>
                <Text color="muted" fontSize="sm">
                  Tell others who you are
                </Text>
              </Box>
            </Stack>
            <Divider />
            <Stack spacing="5" divider={<StackDivider />}>
              <FormControl id="picture">
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Photo</FormLabel>
                  <Stack
                    spacing={{ base: "3", md: "5" }}
                    direction={{ base: "column", sm: "row" }}
                    width="full"
                    maxW={{ md: "3xl" }}
                  >
                    <Avatar size="lg" src={profileData?.image} />
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
              <FormControl
                isInvalid={errors.display_name?.message !== undefined}
                mb={4}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: "1.5", md: "8" }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Name</FormLabel>
                  <VStack
                    alignItems={"flex-start"}
                    w={"full"}
                    maxW={{ md: "3xl" }}
                  >
                    <Input
                      placeholder="Full Name"
                      {...register("display_name")}
                    />
                    <FormErrorMessage>
                      {errors.display_name?.message}
                    </FormErrorMessage>
                  </VStack>
                </Stack>
              </FormControl>

              <Flex direction="row-reverse">
                <Button
                  variant={"primary"}
                  type="submit"
                  loadingText="Save"
                  isLoading={loading}
                >
                  Save
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default WithAuth(UserProfile, USER_TYPE.Admin);

