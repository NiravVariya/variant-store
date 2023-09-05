import { db } from "@/firebase/client";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";

const HomeCarousel = () => {
    const [storeData, setStoreData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    useEffect(() => {
        const fetchStoreSettingData = () => {
            const newdocRef = collection(db, "storeSetting");
            onSnapshot(newdocRef, (querydata) => {
                let newArray: any = [];
                querydata.docs.map((item: any) => {
                    newArray.push(item.data());
                    setStoreData(item.data()?.homeSliders || []);
                    setLoading(false);
                })
            });
        }
        fetchStoreSettingData();
    }, [])

    return (
        <>
            {
                loading ? (
                    <Flex justifyContent={"center"} mt={4}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                            display={"flex"}
                            alignItems={"center"}

                        />
                    </Flex>
                ) : (
                    <Carousel
                        responsive={responsive}
                        itemClass="image-item"
                        additionalTransfrom={0}
                        arrows
                        autoPlaySpeed={3000}
                        centerMode={false}
                        className=""
                        containerClass="container-with-dots"
                        dotListClass=""
                        draggable={false}
                        focusOnSelect={false}
                        infinite
                        keyBoardControl
                        minimumTouchDrag={80}
                        pauseOnHover
                        renderArrowsWhenDisabled={false}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        rewind={false}
                        rewindWithAnimation={false}
                        rtl={false}
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                    >
                        {storeData && storeData.map((image: any, index: any) => {
                            return (
                                <Stack
                                    key={index}
                                    width={"100%"}
                                    mt={{ base: -5 }}
                                    height={{ base: "330px", md: "320px", lg: "450px", xl: "600px" }}
                                    cursor={"pointer"}
                                >
                                    <Image
                                        draggable={false}
                                        style={{
                                            objectFit: "contain",
                                        }}
                                        src={image.image}
                                        alt="alt"
                                        key={index}
                                        className="SliderImages"
                                        onClick={() =>
                                            router.push(image.redirectLink ? image.redirectLink : "")
                                        }
                                        fill
                                    />
                                </Stack>
                            );
                        })}
                    </Carousel>
                )
            }
        </>
    )
}

export default HomeCarousel;