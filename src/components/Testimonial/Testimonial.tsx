import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import testimonial from "@/assets/testimonials.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";
import Carousel from "react-multi-carousel";
import { useRouter } from "next/router";
import Image from "next/image";

export const Testimonial = () => {

  const reduxData = useSelector((state: any) => state.icon);
  const [storeData, setStoreData] = useState([])
  const [storeDocId, setStoreDocId] = useState("")
  const { locale } = useRouter()
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap) => {
    settingSnap.docs.map((value) => {
      const dataref: any = doc(db, "storeSetting", value.id);
      setStoreDocId(dataref.id);
    });
  });

  useEffect(() => {
    if (storeDocId) {
      const newdocRef = collection(db, "storeSetting", storeDocId, "TestimonialInfo");
      onSnapshot(newdocRef, (querydata) => {
        let newArray: any = [];
        querydata.docs.map((item: any) => {
          newArray.push(item.data())
          setStoreData(newArray)
        })
      });
    }
  }, [storeDocId])


  return (
    <Box
      minH="720px"
      position="relative"
      display={{ base: "none", lg: storeData.length == 0 ? "none" : "block" }}
      mb={5}
    >
      <Stack
        pe={'7rem'}
        pt={{ base: "4rem", lg: "8rem", xl: "3.7rem" }}
        width={{ base: "50%", lg: "70%", xl: "50%" }}
        position="relative"
        zIndex={10000}
        float={'right'}
      >
        <Carousel
          responsive={responsive}
          autoPlay={true}
          // autoPlaySpeed={1000}
          showDots={true}
          slidesToSlide={1}
          keyBoardControl={true}
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          className="HomeCarousel"
          draggable={true}
          infinite={true}
          containerClass="container-with-dots"
          itemClass="image-item"
        >
          {storeData && storeData.map((data: any, index: any) => {
            return (
              <AspectRatio
                ratio={4 / 3}
                transition="all 200ms"
                _hover={{ opacity: 1 }}
                key={index}
              >
                <Container
                  bg={"#b2bdb5"}
                  flexDir="column"
                  color={"#fff"}
                  padding={{ base: "1rem", md: "5rem", lg: "2rem", xl: "3rem", '2xl': "5rem" }}
                  style={{
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Heading
                    as="h3"
                    fontSize={{ md: "x-large", lg: "xx-large", xl: "xx-large", '2xl': "xx-large" }}
                    pb={4}
                    mb={{ base: 0, md: 15 }}
                    lineHeight={1.5}
                  >
                    {data.heading[locale]}
                  </Heading>
                  <Text
                    pb={5}
                    fontSize={{ base: "md", md: "xl" }}
                    borderBottom={"2px solid #fff"}
                  >
                    {data.text[locale]}
                  </Text>
                  <Heading
                    as="h4"
                    fontSize={{ base: "large", md: "x-large" }}
                    lineHeight={{ base: 2, md: 2.5 }}
                  >
                    {data.name[locale]}
                  </Heading>
                  <Text pb={5} fontSize="xl">
                    {data.city[locale]}
                  </Text>
                </Container>
              </AspectRatio>
            );
          })}
        </Carousel>
      </Stack>
      <Flex
        id="image-wrapper"
        position="absolute"
        insetX="0"
        insetY="0"
        w="full"
        h="full"
        overflow=""
        align="center"
      >
        <Box position="relative" w="full" h="full">
          <Image
            src={reduxData.storeSetData && reduxData.storeSetData.testimonial ? reduxData.storeSetData.testimonial : testimonial}
            alt="Main Image"
            style={{
              position: "absolute",
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            width={100}
            height={100}
            unoptimized
            className="bannerImg"
          />
        </Box>
      </Flex>
    </Box >
  );
};


export const TestimonialMobile = () => {

  const [storeData, setStoreData] = useState([])
  const [storeDocId, setStoreDocId] = useState("")

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap) => {
    settingSnap.docs.map((value) => {
      const dataref: any = doc(db, "storeSetting", value.id);
      setStoreDocId(dataref.id);
    });
  });

  useEffect(() => {
    if (storeDocId) {
      const newdocRef = collection(db, "storeSetting", storeDocId, "TestimonialInfo");
      onSnapshot(newdocRef, (querydata) => {
        let newArray: any = [];
        querydata.docs.map((item: any) => {
          newArray.push(item.data())
          setStoreData(newArray)
        })
      });
    }
  }, [storeDocId])
  const { locale } = useRouter()
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Box as="section" minH="150px" display={{ base: "block", lg: "none" }}>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        // autoPlaySpeed={1000}
        showDots={true}
        slidesToSlide={1}
        keyBoardControl={true}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        className="HomeCarousel"
        draggable={true}
        infinite={true}
        containerClass="container-with-dots"
        itemClass="image-item"
      >
        {storeData && storeData.map((data: any, index: any) => {
          return (
            <AspectRatio
              ratio={4 / 3}
              transition="all 200ms"
              _hover={{ opacity: 1 }}
              key={index}
            >
              <Container
                bg={"#b2bdb5"}
                flexDir="column"
                color={"#fff"}
                padding={{ base: "1rem", md: "5rem" }}
                style={{
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <Heading
                  as="h1"
                  fontSize={{ base: "x-large", md: "xxx-large" }}
                  pb={4}
                  mb={{ base: 0, md: 15 }}
                  lineHeight={1.5}
                >
                  {data.heading[locale]}
                </Heading>
                <Text
                  pb={5}
                  fontSize={{ base: "md", md: "xl" }}
                  borderBottom={"2px solid #fff"}
                >
                  {data.text[locale]}
                </Text>
                <Heading
                  as="h4"
                  fontSize={{ base: "large", md: "x-large" }}
                  lineHeight={{ base: 2, md: 2.5 }}
                >
                  {data.name[locale]}
                </Heading>
                <Text pb={5} fontSize="lg">
                  {data.city[locale]}
                </Text>
              </Container>
            </AspectRatio>
          );
        })}
      </Carousel>
    </Box>
  );
};
