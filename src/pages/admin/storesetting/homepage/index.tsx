import USER_TYPE from "@/auth/constans";
import WithAuth from "@/auth/withAuth";
import HomeSlider from "@/components/Admin/HomeSlider/HomeSlider";
import OfferBanner from "@/components/Admin/OfferBenner/OfferBenner";
import OfferHeaderLine from "@/components/Admin/OfferHeaderLine/OfferHeaderLine";
import PromotingImages from "@/components/Admin/PromotingImages/PromotingImages";
import TestimonialImage from "@/components/Admin/TestimonialImage/TestimonialImage";
import TestimonialSection from "@/components/Admin/TestimonialSection/TestimonialSection";
import TopBrandsLogos from "@/components/Admin/TopBrandsLogos/TopBrandsLogos";
import { db } from "@/firebase/client";
import { setStoreSetDataRef } from "@/store";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


function Homepage() {
    const dispatch = useDispatch();

    useEffect(() => {
        const settingStoreRef = collection(db, "storeSetting");
        onSnapshot(settingStoreRef, (settingSnap) => {
            settingSnap.docs.map((value) => {
                const dataref: any = doc(db, "storeSetting", value.id);
                dispatch(setStoreSetDataRef(dataref));
            });
        });
    }, []);

    return (
        <>
            <HomeSlider />
            <TopBrandsLogos />
            <OfferHeaderLine />
            <PromotingImages />
            <OfferBanner />
            <TestimonialImage />
            <TestimonialSection />
        </>

    )
}

export default WithAuth(Homepage, USER_TYPE.Admin);