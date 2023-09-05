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
  CloseButton,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import randomstring from "randomstring";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/client";
import handleError from "@/utils/handleError";
import { getImagesWidtHeight } from "./ImageSizeCheck";

function DropMultiImgBox(props: any) {
  const auth = useAuth();
  const [StoreLogo, setStoreLogo] = useState([]);

  useEffect(() => {
    setStoreLogo(JSON.parse(JSON.stringify(props.storeLogo)) || [])
  }, [props]);

  return (
    <>
      <Flex
        borderWidth="1px"
        borderRadius="lg"
        px="6"
        py="4"
        bg={useColorModeValue("white", "gray.800")}
        gap={5}
        flexWrap="wrap"
        flexDir={{ base: "column" }}
        justifyContent={"start"}
      >
        {props.storeLogo?.length === 0 ? (
          <VStack spacing="3" w={"full"}>
            {props.isUploading ? (
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
          <Square
            cursor={"pointer"}
            gap={5}
            flexDir={{ md: "row" }}
            flexWrap="wrap"
            minWidth="auto"
            justifyContent={"start"}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              cursor={"pointer"}
              onClick={() => props.storeLogoInput.current.click()}
              width={160}
            >
              {props.isUploading ? (
                <Flex alignItems={"center"} justifyContent="center">
                  <Spinner />
                </Flex>
              ) : (
                <>
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
                </>
              )}
            </Flex>
            {StoreLogo &&
              StoreLogo.map((item: any, index: number) => {
                return (
                  <Box key={index} position={"relative"}>
                    <CloseButton
                      size="sm"
                      position={"absolute"}
                      zIndex={1}
                      onClick={() => props.handleDeleteImage(index)}
                      bg={"#fff"}
                      borderRadius={0}
                    />
                    {
                      props.isOpenModel === true ? (
                        <Tooltip hasArrow label='Add redirect link' bg='gray.300' color='black'>
                          <Image
                            key={index}
                            src={item.image}
                            alt={"Cover Photo"}
                            width={150}
                            height={150}
                            onClick={() => {
                              props.onOpen()
                              props.handleIndex(index)
                            }}
                            unoptimized={process.env.NEXT_PUBLIC_ENV === "DEV"}
                            style={{
                              height: "150px",
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Image
                          key={index}
                          src={item}
                          alt={"Cover Photo"}
                          width={150}
                          height={150}
                          unoptimized={process.env.NEXT_PUBLIC_ENV === "DEV"}
                          style={{
                            height: "150px",
                          }}
                        />
                      )
                    }
                  </Box>
                );
              })}
          </Square>
        )}
      </Flex>
      <input
        ref={props.storeLogoInput}
        onChange={async (e) => {
          const files: any = e.target.files;
          if ((files.length + props.storeLogo.length) > 2 && props.promoting) {
            toast.success("you have add only 2 images");
            return;
          } else {
            try {
              for (const file of files) {

                await getImagesWidtHeight(file, props.width, props.height, async (data: any) => {
                  if (data) {
                    props.setIsUploading(true);
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("Maximum file size allowed is 5MB");
                      return;
                    }
                    const storageRef = ref(
                      storage,
                      `storeSetting/${auth.user.uid}/${props.promoting ? "promotingImgs" : "homeSliders"
                      }/${randomstring.generate()}`
                    );
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    const updateArray = StoreLogo
                    if (props.isOpenModel == true) {
                      updateArray?.push({ image: url, redirectLink: props.redictLink })
                      setStoreLogo(updateArray)
                      props.setStoreLogo(updateArray)
                    } else {
                      updateArray?.push(url)
                      setStoreLogo(updateArray)
                      props.setStoreLogo(updateArray)
                    }
                    props.setIsUploading(false);
                  }
                });
              }
            } catch (error) {
              // setIsUploading(false);
              // handleError(error);
            }
          }
        }}
        type="file"
        hidden
        id="fileButton"
        data-testid="file-upload-input"
        multiple
        accept=".jpg, .jpeg, .png"
      />
    </>
  );
}

export default DropMultiImgBox;
