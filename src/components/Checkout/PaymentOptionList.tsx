import { db } from "@/firebase/client";
import useTranslation from "@/hooks/useTranslation";
import { Divider, Flex, HStack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { collection, getDocs } from "@firebase/firestore";
import { paymentOptionsConfig } from "config/paymentInfo.config";
import { useEffect, useState } from "react";

export function PaymentOptionList({ cartData, orderId }: any) {
    const [paymentOptionList, setPaymentOptionList] = useState<any>([]);
    const [isLoading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        // get payment option list
        setLoading(true);
        (async () => {
            const projectInfo = collection(db, "storeSetting");
            const docs = await getDocs(projectInfo);
            const storeSetingDocRef = docs.docs[0].ref;
            const paymentInfoRef = collection(storeSetingDocRef, "paymentDetails");
            const paymentInfoDocs = await getDocs(paymentInfoRef);
            let paymentInfoList: string[] = [];
            paymentInfoDocs.forEach((doc) => {
                const paymentOptionData: any = doc.data();
                paymentInfoList.push(paymentOptionData);
            });

            setPaymentOptionList(paymentInfoList);
            setLoading(false);
        })();
    }, []);

    // add loading
    return (
        <>
            {isLoading && (
                <Flex justifyContent={"center"} alignItems={"center"}>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="#2B9CB1"
                        size="xl"
                    />
                </Flex>
            )}

            {!isLoading &&
                paymentOptionList.map(({ selectedPayment, paymentKey }: any) => {
                    const Component: any =
                        paymentOptionsConfig[selectedPayment.toLowerCase()].Component;
                    return (
                        <Component
                            paymentKey={paymentKey}
                            cartData={cartData}
                            key={selectedPayment}
                            orderId={orderId}
                        />
                    );
                })}

            {!isLoading && paymentOptionList.length !== 0 && (
                <HStack>
                    <Divider />
                    <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                        {t("CheckOut.OrContinueWith")}
                    </Text>
                    <Divider />
                </HStack>
            )}
        </>
    );
}
