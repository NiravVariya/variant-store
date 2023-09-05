import {
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import randomstring from "randomstring";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";

import { addFile } from "@/services/storage_service";
import handleError from "@/utils/handleError";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";

type Props = {
  multiple?: boolean;
  onUpload: (url: string) => void;
  path: string;
  accept?: string;
  metadata?: { contentType: string };
  fileInputRef: React.MutableRefObject<HTMLInputElement>;
  uploadedImage: string;
  uid?: string;
};

const Dropzone = ({
  onUpload,
  path,
  fileInputRef,
  multiple = false,
  uploadedImage,
  uid,
  accept = "image/png, image/gif, image/jpeg",
  metadata = { contentType: "image/jpeg" },
}: Props) => {
  const localFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files[0];
      setProgress(0)
      setIsUploading(true);
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Maximum file size allowed is 5MB");
        return;
      }

      const filePath = uid
        ? `${path}/${uid}`
        : `${path}/${randomstring.generate()}`;
      await addFile(
        filePath,
        file,
        metadata,
        setIsUploading,
        setProgress,
        onUpload
      );
    } catch (error) {
      setIsUploading(false);
      setProgress(0);
      handleError(error);
    }
  };

  const handleClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
    else localFileInputRef.current.click();
  };

  return (
    <Center
      borderWidth="1px"
      borderRadius="lg"
      px="6"
      py="4"
      bg={useColorModeValue("white", "gray.800")}
    >
      {uploadedImage === "" ? (
        <VStack spacing="3" w={"full"}>
          {isUploading ? (
            <CircularProgress
              data-testid="file-upload-progress"
              my={4}
              value={progress}
              color="green.400"
            >
              <CircularProgressLabel>
                {Math.trunc(progress)}%
              </CircularProgressLabel>
            </CircularProgress>
          ) : (
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              cursor={"pointer"}
              onClick={handleClick}
            >
              <Square size="10" bg="bg-subtle" borderRadius="lg">
                <Icon as={FiUploadCloud} boxSize="5" color="muted" />
              </Square>
              <VStack spacing="1">
                <HStack spacing="1" whiteSpace="nowrap">

                  <Button variant="link" colorScheme="brand" color="primaryColor" size="sm" isDisabled={isUploading}>
                    {t("Profile.ClickToUpload")}
                  </Button>
                </HStack>
                <Text fontSize="xs" color="muted">
                {t("Profile.PNG,JPGorGIFupto5MB")}
                </Text>
              </VStack>
            </Flex>
          )}
        </VStack>
      ) : (
        <Square cursor={"pointer"}>
          <Image
            src={uploadedImage}
            alt={"Cover Photo"}
            width={150}
            height={150}
            onClick={handleClick}
            unoptimized={process.env.NEXT_PUBLIC_ENV === "DEV"}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Square>
      )}

      <input
        ref={fileInputRef ?? localFileInputRef}
        onChange={handleFileUpload}
        type="file"
        hidden
        id="fileButton"
        data-testid="file-upload-input"
        multiple={multiple}
        accept={accept}
      />
    </Center>
  );
};

export default Dropzone;
