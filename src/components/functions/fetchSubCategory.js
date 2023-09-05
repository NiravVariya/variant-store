import { db } from "@/firebase/client";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export const fetchSubCategory = function (categotyInfoId, callback) {
  console.log("props", categotyInfoId);
  const refquery = collection(db, "Categories", categotyInfoId, "Subcategory");
  const subCategoryRef = query(refquery, orderBy("createdAt", "desc"));
  onSnapshot(subCategoryRef, (querydata) => {
    let newArray = [];
    querydata.docs.map((docvalue) => {
      newArray.push({ ...docvalue.data(), id: docvalue.id });
    });
    callback(newArray);
  });
};
