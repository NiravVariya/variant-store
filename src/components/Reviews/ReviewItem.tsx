import { Rating } from "./Rating";
import { Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";

export const ReviewItem = (props: any) => {
    const { review } = props;

    return (<>
        <Stack spacing="2.5">
            <Stack direction="row" spacing="3">
                <Rating defaultValue={review.startValue} size="sm" />
                <Heading
                    size="sm"
                    fontWeight="medium"
                    color={useColorModeValue("black", "white")}
                >
                    {review.title}
                </Heading>
            </Stack>
            <Text>{review.comment}</Text>
            <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontSize="sm"
            >
                by {review.userName}, {review.createdAt.toDate().toString().split(' ').splice(1, 3).join(' ')}
            </Text>
        </Stack>
    </>);
};
