import { db } from "@/firebase/client";
import {
    collection,
    doc,
    onSnapshot,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStoreSetDataRef } from "@/store";
import WithAuth from "@/auth/withAuth";
import USER_TYPE from "@/auth/constans";
import TermsAndConditions from "@/components/Admin/TermsAndConditions";
import PrivacyPolicy from "@/components/Admin/PrivacyPolicy";

function TermsAndPrivacy() {
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
            <TermsAndConditions />
            <PrivacyPolicy />
        </>
    );
}

export default WithAuth(TermsAndPrivacy, USER_TYPE.Admin);