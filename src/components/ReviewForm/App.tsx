import useTranslation from "@/hooks/useTranslation";
import {
    Box,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { Form } from "./Form";

export const ReviewForm = (props: any) => {
    const closeModel = (close: any) => {
        return props.close(close);
    }
    const { t } = useTranslation();

    return (
        <Box>
            <Modal
                isOpen={props.open}
                onClose={props.close}
                size="xl"
                isCentered
                blockScrollOnMount={false}
                trapFocus={false}
            >
                <ModalOverlay />
                <ModalContent
                    borderRadius="xl"
                    mx={{ base: "2.5", lg: "16" }}
                    overflow="hidden"
                >
                    <ModalCloseButton
                        top="0"
                        right="0"
                        size="lg"
                        borderRadius="none"
                        borderBottomLeftRadius="md"
                    />
                    <ModalBody
                        px={{ base: "5", md: "12", lg: "16" }}
                        py={{ base: "10", md: "12", lg: "16" }}
                        pb={{ base: "6" }}
                    >
                        <Stack spacing="6">
                            <Heading
                                fontSize="2xl"
                                fontWeight="semibold"
                                color={useColorModeValue("black", "white")}
                            >
                                {t("ReviewForm.WriteAReview")}
                            </Heading>
                            <Form idProduct={props.idProduct} closeModel={closeModel} />
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
