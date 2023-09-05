import USER_TYPE from "@/auth/constans";
import WithAuth from "@/auth/withAuth";
import { db } from "@/firebase/client";
import { setStoreSetDataRef } from "@/store";
import { collection, doc, onSnapshot } from "firebase/firestore";
import CustomDomain from "@/components/CustomDomain/CustomDomain";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function CustomDomainSection() {
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
            <CustomDomain />
        </>
    )
}

export default WithAuth(CustomDomainSection, USER_TYPE.Admin);