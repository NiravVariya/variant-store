import USER_TYPE from "@/auth/constans";
import WithAuth from "@/auth/withAuth";
import ContactInfo from "@/components/Admin/ContactInfo/ContactInfo";
import FooterCopyrightLine from "@/components/Admin/FooterCopyrightLine/FooterCopyrightLine";
import SocialMediaLinks from "@/components/Admin/SocialMediaLinks/SocialMediaLinks";
import { db } from "@/firebase/client";
import { setStoreSetDataRef } from "@/store";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function ContactAndFooter() {
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
            <ContactInfo />
            <FooterCopyrightLine />
            <SocialMediaLinks />
        </>
    )
}

export default WithAuth(ContactAndFooter, USER_TYPE.Admin);