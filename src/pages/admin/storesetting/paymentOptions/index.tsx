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
import PaymentSection from "@/components/Admin/PaymentSection/PaymentSection";
import CurrencySection from "@/components/Admin/CurrencySection/CurrencySection";

function PaymentOptions() {
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
            <PaymentSection />
            <CurrencySection /> 
        </>
    );
}

export default WithAuth(PaymentOptions, USER_TYPE.Admin);