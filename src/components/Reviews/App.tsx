import { Rating } from "./Rating";
import {
    Box,
    Button,
    Flex,
    Heading,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { ReviewItem } from "./ReviewItem";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";

export const Reviews = (props: any) => {
    ;
    const [reviewData, setReviewData] = useState<any>([]);
    const [totalReview, setTotalReview] = useState<number>(0);
    const [loading, setloading] = useState(true);
    const [allshow, setAllshow] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchReviewData();
    }, [props.idProduct])

    const fetchReviewData = async () => {
        if (props.idProduct) {
            const productRef = collection(db, "storeProducts", props.idProduct, "reviews");
            await onSnapshot(productRef, (productSnap) => {
                const reviewArray: any = [];
                productSnap.docs.map(async (res) => {
                    reviewArray.push({ ...res.data() })
                    const mappedArray = reviewArray.map((element: any) => element.startValue);
                    const startingAverage = mappedArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue) / mappedArray.length;
                    const docRef = doc(db, "storeProducts", props.idProduct);
                    const updateSubDetails = await updateDoc(docRef, {
                        AvgRating: startingAverage,
                    })
                    setTotalReview(startingAverage);
                    setReviewData(reviewArray);
                    setloading(false);
                })
                setloading(false);
            });
        }
    }

    const handleShow = () => {
        setAllshow(true)
    }

    return (
        <>
            {loading && <>
                <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                    <Spinner />
                </Flex>
            </>}
            {!loading && (
                <Box
                    maxW="7xl"
                    mx="auto"
                    px={{ base: "4", md: "8", lg: "12" }}
                    py={{ base: "6", md: "8", lg: "12" }}
                >
                    <Stack spacing="">
                        <Stack spacing={{ base: "8" }}>
                            {/* <Heading
                                fontSize={{ base: "1.25rem", md: "1.5rem" }}
                                fontWeight="semibold"
                            >
                                {t("ProductDetails.CustomerReviews")}
                            </Heading> */}
                            {/* <Stack
                                spacing="5"
                                direction="row"
                                alignItems="center"
                                shouldWrapChildren
                                justifyContent={"space-between"}
                            >
                                <Stack direction="row">
                                    <Text
                                        fontSize="4xl"
                                        fontWeight="medium"
                                        lineHeight="1"
                                    >
                                        {totalReview.toFixed(2)}
                                    </Text>
                                    <Stack spacing="1">
                                        <Rating defaultValue={totalReview} size="sm" />
                                        <Text
                                            lineHeight="1"
                                        >
                                            {t("ProductDetails.Basedon")} {reviewData.length} {t("ProductDetails.Reviews")}
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Stack> */}
                        </Stack>
                        <SimpleGrid
                            columns={{ base: 1, md: 1 }}
                            columnGap="12"
                            rowGap={{ base: "10", md: "12" }}
                        >
                            {
                                reviewData.length == 0 ? (
                                    <Text>{t("ProductDetails.NoReviews")}</Text>
                                ) : (
                                    reviewData.map((review: any, index: number) => (
                                        allshow ? <ReviewItem key={index} review={review} /> :
                                            index < 4 ? (
                                                <ReviewItem key={index} review={review} />
                                            ) : null
                                    ))
                                )
                            }
                        </SimpleGrid>
                        {
                            reviewData.length > 4 ? (
                                <Stack>
                                    <Button size="lg" variant="outline" alignSelf="center" onClick={() => handleShow()}>
                                    {t("ProductDetails.SeeAllReviews")}
                                    </Button>
                                </Stack>
                            ) : null
                        }
                    </Stack>
                </Box>
            )}
        </>
    );
};
