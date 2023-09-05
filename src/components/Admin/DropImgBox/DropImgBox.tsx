import useAuth from "@/hooks/useAuth";
import {
  Flex,
  Spinner,
  Square,
  VStack,
  Icon,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Center,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import randomstring from "randomstring";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/client";
import handleError from "@/utils/handleError";
import { getImagesWidtHeight } from "./ImageSizeCheck";

function DropImgBox(props: any) {
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth();
  return (
    <>
      <Center
        borderWidth="1px"
        borderRadius="lg"
        px="6"
        py="4"
        bg={useColorModeValue("white", "gray.800")}
      >
        {props.storeLogo === "" ? (
          <VStack spacing="3" w={"full"}>
            {isUploading ? (
              <Spinner />
            ) : (
              <Flex
                flexDirection={"column"}
                alignItems={"center"}
                cursor={"pointer"}
                onClick={() => props.storeLogoInput.current.click()}
              >
                <Square size="10" bg="bg-subtle" borderRadius="lg">
                  <Icon as={FiUploadCloud} boxSize="5" color="muted" />
                </Square>
                <VStack spacing="1">
                  <HStack spacing="1" whiteSpace="nowrap">
                    <Button
                      variant="link"
                      colorScheme="brand"
                      color={"#242F51"}
                      size="sm"
                      // isDisabled={isUploading}
                    >
                      Click to upload
                    </Button>
                  </HStack>
                  <Text fontSize="xs" color="muted">
                    PNG, JPG or GIF up to 5MB
                  </Text>
                </VStack>
              </Flex>
            )}
          </VStack>
        ) : (
          <Image
            src={props.storeLogo}
            alt={"Cover Photo"}
            // width={24}
            height={24}
            onClick={() => props.storeLogoInput.current.click()}
            style={{
              maxWidth: "100%",
              // height: "auto",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        )}
      </Center>
      <input
        ref={props.storeLogoInput}
        onChange={async (e) => {
          try {
            const file = e.target.files[0];
            await getImagesWidtHeight(file, props.width, props.height, async (data: any) => {
              if(data){
                setIsUploading(true);
                if (file.size > 5 * 1024 * 1024) {
                  toast.error("Maximum file size allowed is 5MB");
                  return;
                }
                const filePath = `storeSetting/${
                  auth.user.uid
                }/storeLogo/${randomstring.generate()}`;
                const storageRef = ref(storage, filePath);
  
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                props.setStoreLogo(url);
                setIsUploading(false);
              }
            });
            props.setStoreErrors({
              ...props.storeErrors,
              storeLogo: "",
              testimonialImg: "",
              offerBanner: "",
            });
          } catch (error) {
            setIsUploading(false);
            handleError(error);
          }
        }}
        type="file"
        hidden
        id="fileButton"
        data-testid="file-upload-input"
      />
    </>
  );
}

export default DropImgBox;