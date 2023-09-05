import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";

export function storeData(callback: any) {
    const newdocRef = collection(db, "storeSetting");
    return onSnapshot(newdocRef, (querydata) => {
        querydata.docs.map((item: any) => {
            callback(item.data())
            return item.data();
        })
    });

}