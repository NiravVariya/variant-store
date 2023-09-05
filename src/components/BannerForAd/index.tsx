import {
    Box,
    Flex,
    Heading,
    Text
  } from "@chakra-ui/react";
  import Image from "next/image";
  import { useRouter } from "next/router";
  import { useSelector } from "react-redux";
  
  const BannerForAd = () => {
    const reduxData = useSelector((state: any) => state.icon);
    const { locale } = useRouter();
  
    return (
      <Box
        bg="gray.800"
        as="section"
        minH={{ base: "400px", md: "600px" }}
        position="relative"
        display={reduxData.storeSetData.offerBenner ? "block" : "none"}
      >
        <Box
          py={{ base: "16", md: "32" }}
          position="relative"
          zIndex={1}
          px={{ base: '0rem', lg: '18rem' }}
          display="flex"
          justifyContent={{ base: 'start', md: 'center', lg: 'end' }}
        >
          <Box
            px={{ base: "6", md: "8" }}
            color="white"
          >
            <Box maxW="xl">
              <Text fontSize={{ md: "2xl" }} mt="4" maxW="lg" py={{ base: "4", md: "8" }}>
                {reduxData.storeSetData &&
                  reduxData.storeSetData.offerBenner &&
                  reduxData.storeSetData.offerBenner.introLine[locale]}
              </Text>
              <Heading as="h1" size={{ base: "sm", md: "lg", xl: "3xl" }} fontWeight="extrabold">
                {reduxData.storeSetData &&
                  reduxData.storeSetData.offerBenner &&
                  reduxData.storeSetData.offerBenner.heading[locale]}
              </Heading>
            </Box>
          </Box>
        </Box>
        <Flex
          id="image-wrapper"
          position="absolute"
          insetX="0"
          insetY="0"
          w="full"
          h="full"
          overflow="hidden"
          align="center"
        >
          <Box position="relative" w="full" h="full">
            <Image
              src={reduxData.storeSetData.offerBenner && reduxData.storeSetData.offerBenner.img}
              alt="Main Image"
              style={{
                position: "absolute",
                objectFit: "cover",
                objectPosition: "top bottom",
                width: '100%',
                height: '100%'
              }}
              width={1970}
              height={600}
              className={locale == "ar" ? "ImageScale" : "bannerImg"}
            />
          </Box>
        </Flex>
      </Box>
    );
  };
  
  export default BannerForAd;