import { db } from "@/firebase/client";
import {
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect } from "react";
import ColorInfo from "@/components/Admin/ColorInfo/ColorInfo";
import { useDispatch } from "react-redux";
import { setStoreSetDataRef } from "@/store";
import StoreLogo from "@/components/Admin/StoreLogo/StoreLogo";
import WithAuth from "@/auth/withAuth";
import USER_TYPE from "@/auth/constans";

function LogoAndColors() {
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
      <StoreLogo />
      <ColorInfo />
    </>
  );
}

export default WithAuth(LogoAndColors, USER_TYPE.Admin);