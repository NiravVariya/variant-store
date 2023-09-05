import { db } from "@/firebase/client";
import { Progress, Text } from "@chakra-ui/react";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function Progressbar() {
    const [progressValue, setProgressValue] = useState<number>(0);
    const [storeDocId, setStoreDocId] = useState<string>("");

    useEffect(() => {
        const storeSettingRef = collection(db, "storeSetting");
        const storeProductRef = collection(db, "storeProducts");

        const fetchProgressValues = async () => {
            let storeSettingProgress = 0;
            let storeProductProgress = 0;
            let storeTestimonialProgress = 0;

            const storeSettingSnapshot = await getDocs(storeSettingRef);
            storeSettingSnapshot.forEach((value) => {
                if (value.data()?.primaryColor) {
                    storeSettingProgress += 25;
                }
                if (value.data()?.customDomain) {
                    storeSettingProgress += 25;
                }
                if (value.data()?.homeSliders) {
                    storeSettingProgress += 3.57;
                }
                if (value.data()?.brandLogos) {
                    storeSettingProgress += 3.57;
                }
                if (value.data()?.offerHeading) {
                    storeSettingProgress += 3.57;
                }
                if (value.data()?.promotingImgs) {
                    storeSettingProgress += 3.57;
                }
                if (value.data()?.offerBenner) {
                    storeSettingProgress += 3.57;
                }
                if (value.data()?.testimonial) {
                    storeSettingProgress += 3.57;
                }

                // Update storeDocId with the latest document ID
                setStoreDocId(value?.id);
            });

            const storeProductSnapshot = await getDocs(storeProductRef);
            if (storeProductSnapshot.docs?.length !== 0) {
                storeProductProgress += 25;
            }

            if (storeDocId) {
                const storeTestimonialRef = collection(
                    db,
                    "storeSetting",
                    storeDocId,
                    "TestimonialInfo"
                );
                const storeTestimonialSnapshot = await getDocs(storeTestimonialRef);
                if (storeTestimonialSnapshot.docs?.length !== 0) {
                    storeTestimonialProgress += 3.59;
                }
            }

            const overallProgress =
                storeSettingProgress + storeProductProgress + storeTestimonialProgress;
            setProgressValue(overallProgress);
        };

        // Call the function to fetch and calculate progress values
        fetchProgressValues();

        // Subscribe to the snapshots for real-time updates
        const unsubscribeStoreSetting = onSnapshot(storeSettingRef, () =>
            fetchProgressValues()
        );
        const unsubscribeStoreProduct = onSnapshot(storeProductRef, () =>
            fetchProgressValues()
        );

        // Cleanup the listeners when the component unmounts
        return () => {
            unsubscribeStoreSetting();
            unsubscribeStoreProduct();
        };
    }, [storeDocId]);

    return (
        <>
            <Text fontSize={{ base: "sm", md: "md" }}>Task Completed ({progressValue.toFixed(0)}%)</Text>
            <Progress value={progressValue} size='sm' width={"80%"} />
        </>
    )
}

export default Progressbar;