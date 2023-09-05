import USER_TYPE from "@/auth/constans";
import WithAuth from "@/auth/withAuth";
import AboutSection from "@/components/Admin/AboutSection/AboutSection";
import { db } from "@/firebase/client";
import { setStoreSetDataRef } from "@/store";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function Aboutus() {
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
        <AboutSection />
    )
}

export default WithAuth(Aboutus, USER_TYPE.Admin);