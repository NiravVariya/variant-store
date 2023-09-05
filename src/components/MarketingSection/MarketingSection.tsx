import React from "react";
import Image from "next/image";
import {
  Button,
  Flex,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";

export const MarketingSection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const reduxData = useSelector((state: any) => state.icon);

  return (
    <>
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        gap={{ base: 3, md: 50 }}
      >
        <Stack
          _hover={{
            opacity: 0.9,
            boxShadow:
              "0px -4px 32px rgba(0, 0, 0, 0.25), inset 0px 4px 32px rgba(0, 0, 0, 0.25)",
          }}
          display={reduxData.storeSetData.promotingImgs && reduxData.storeSetData.promotingImgs[0] ? "flex" : "none"}
          alignItems={'center'}
          justifyContent="center"
          zIndex={100}
        >
          <Image
            src={reduxData.storeSetData && reduxData.storeSetData.promotingImgs && reduxData.storeSetData.promotingImgs[0]}
            alt="look Image"
            style={{ position: "relative", width: "100%", height: "100%" }}
            objectFit="contain"
            width={900}
            height={100}
          />
          <Button
            bg={"transparent"}
            variant="none"
            fontWeight="extrabold"
            pos="absolute"
            _hover={{
              background: "rgba(0, 0, 0, 0.2)",
              color: "#fff",
            }}
            color="#fff"
            onClick={() => router.push(reduxData.storeSetData && reduxData.storeSetData.promotionImageLink && reduxData.storeSetData.promotionImageLink.firstImageLink)}
          >
            {t("Home.ViewButton")}
          </Button>
        </Stack>
        <Spacer display={{ base: "none", md: "block" }} />
        <Stack
          _hover={{
            opacity: 0.9,
            boxShadow:
              "0px -4px 32px rgba(0, 0, 0, 0.25), inset 0px 4px 32px rgba(0, 0, 0, 0.25)",
          }}
          display={reduxData.storeSetData.promotingImgs && reduxData.storeSetData.promotingImgs[1] ? "flex" : "none"}
          alignItems={'center'}
          justifyContent="center"
        >
          <Image
            src={reduxData.storeSetData && reduxData.storeSetData.promotingImgs && reduxData.storeSetData.promotingImgs[1]}
            alt="fastrack Image"
            width={900}
            height={100}
            style={{ position: "relative", width: "100%", height: "100%" }}
          />
          <Button
            bg={"transparent"}
            variant="none"
            pos="absolute"
            fontWeight="extrabold"
            _hover={{
              background: "rgba(0, 0, 0, 0.2)",
              color: "#fff",
            }}
            color="#fff"
            onClick={() => router.push(reduxData.storeSetData && reduxData.storeSetData.promotionImageLink && reduxData.storeSetData.promotionImageLink.secondImageLink)}
          >
            {t("Home.ViewButton")}
          </Button>
        </Stack>
      </Flex>
    </>
  );
};