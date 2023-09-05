import { db } from "@/firebase/client";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export const handleDelete = function (id, categotyInfoId) {
  // delete category
  if (id) {
    const deleteService = doc(
      db,
      "Categories",
      categotyInfoId,
      "Subcategory",
      id
    );
    deleteDoc(deleteService).then(() => {
      toast.success("Data deleted successfully...");
    });
  }
};