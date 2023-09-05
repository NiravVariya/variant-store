import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Stack,
    Textarea,
    useColorModeValue,
    Icon,
    FormHelperText,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import useTranslation from "@/hooks/useTranslation";

export const Form = (props: any) => {

    const [userData, setUserData] = useState({
        name: "",
        email: "",
    });
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [userDocId, setUserDocId] = useState("");
    const [startValue, setstartValue] = useState(0);
    const [startValueError, setstartValueError] = useState("");
    const [commentError, setCommentError] = useState("");
    const color = useColorModeValue('gray.200', 'gray.600');
    const { onClose } = useDisclosure();
    const [reviewData, setReviewData] = useState<any>({});
    const [reviewUserDocID, setReviewUserDocID] = useState("");
    const [reviewDocId, setReviewDocId] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        const Uid = localStorage.getItem("userId");
        const fetchStoreDetail = async () => {
            const docRef = collection(db, "storeUsers");
            onSnapshot(docRef, (userSnapshot) => {
                userSnapshot.docs.map((item: any) => {
                    if (item.data().id === Uid) {
                        setUserData({ ...item.data(), itemID: item.id })
                        setUserDocId(item.id);
                    }
                });
            });
        };
        fetchStoreDetail();
    }, []);

    useEffect(() => {
        const fetchReviews = () => {
            const SupplierQuery = query(
                collection(db, "storeProducts"),
                where("userDocId", "==", userDocId)
            );
            onSnapshot(SupplierQuery, (userSnapshot) => {
                const docRef = query(collection(db, "storeProducts", props.idProduct, "reviews"),
                    where("userDocId", "==", userDocId));
                onSnapshot(docRef, async (querydata) => {
                    querydata.docs.map((item: any) => {
                        setReviewData(item.data());
                        setReviewUserDocID(item.data().userDocId);
                        setReviewDocId(item.id);
                        setstartValue(item.data().startValue)
                    });
                });
            })
        };
        fetchReviews();
    }, [userDocId]);

    const submitReview = async () => {
        if (startValue === 0) {
            setstartValueError(t("ReviewForm.RatingValidationMsg"));
        } else if (comment === "") {
            setCommentError(t("ReviewForm.CommnetValidationMsg"));
        } else if (userDocId === reviewUserDocID) {
            const updatePLAN = doc(db, "storeProducts", props.idProduct, "reviews", reviewDocId);
            await updateDoc(updatePLAN, { ...reviewData, startValue: startValue }).then(() => {
                toast.success(t("ReviewForm.UpdateToastMsg"))
                props.closeModel(onClose);
            })
        } else {
            await addDoc(collection(db, "storeProducts", props.idProduct, "reviews"), {
                userName: userData.name,
                title: title,
                comment: comment,
                startValue: startValue,
                userDocId: userDocId,
                productId: props.idProduct,
                productRef: doc(db, "storeProducts", props.idProduct),
                userRef: doc(db, "storeUsers", userDocId),
                createdAt: serverTimestamp()
            }).then(() => {
                setTitle("");
                setComment("");
                setstartValue(0);
                props.closeModel(onClose);
                toast.success(t("ReviewForm.SubmitReviewToastMsg"))
            });

        }
    }

    return (
        <Stack spacing="6">
            <FormControl id="name">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                    {t("ReviewForm.Name")}
                </FormLabel>
                <Input
                    name="name"
                    placeholder="Your name"
                    value={userData.name ? userData.name : ""}
                    focusBorderColor={useColorModeValue("blue.500", "blue.200")}
                />
            </FormControl>
            <FormControl id="email">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                    {t("ReviewForm.Email")}
                </FormLabel>
                <Input
                    name="email"
                    type="email"
                    value={userData.email ? userData.email : ""}
                    placeholder="Your email address"
                    focusBorderColor={useColorModeValue("blue.500", "blue.200")}
                />
            </FormControl>

            <FormControl id="rating">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                    {t("ReviewForm.Rating")}
                </FormLabel>
                <HStack spacing="0.5">
                    {Array.from({ length: 5 })
                        .map((_, index) => index + 1)
                        .map((index) => (
                            <Icon
                                key={index}
                                as={FaStar}
                                fontSize={'md'}
                                color={index <= startValue ? "primaryColor" : color}
                                onClick={() =>
                                    setstartValue(index)
                                }
                            />
                        ))}
                </HStack>
                {startValueError && (
                    <FormHelperText color={"red"}>{startValueError}</FormHelperText>
                )}
            </FormControl>

            <FormControl id="title">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                    {t("ReviewForm.Title")}
                </FormLabel>
                <Input
                    name="title"
                    placeholder={t("ReviewForm.TitleInput")}
                    focusBorderColor={useColorModeValue("blue.500", "blue.200")}
                    value={reviewData.title ? reviewData.title : ""}
                    onChange={(e: any) => {
                        setReviewData({
                            ...reviewData,
                            title: e.target.value
                        });
                        setTitle(e.target.value)
                    }}
                />
            </FormControl>

            <FormControl id="comment">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                    {t("ReviewForm.Comment")}
                </FormLabel>
                <Textarea
                    name="comment"
                    placeholder={t("ReviewForm.CommentInput")}
                    rows={4}
                    focusBorderColor={useColorModeValue("blue.500", "blue.200")}
                    resize="none"
                    borderColor={commentError ? "red" : null}
                    value={reviewData.comment ? reviewData.comment : ""}
                    onChange={(e) => {
                        setReviewData({
                            ...reviewData,
                            comment: e.target.value
                        });
                        setComment(e.target.value);
                        setCommentError("");
                    }}
                />
                {commentError && (
                    <FormHelperText color={"red"}>{commentError}</FormHelperText>
                )}
            </FormControl>
            <Button
                type="submit"
                colorScheme="blue"
                alignSelf="start"
                size="lg"
                className="btn"
                onClick={() => submitReview()}
            >
                {t("ReviewForm.SubmitReview")}
            </Button>
        </Stack>
    );
}
