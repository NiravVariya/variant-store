import { FormUser, UserStatus } from "@/types/user";
import paths from "@/utils/paths";
import { orderBy, query, updateDoc, where } from "firebase/firestore";

export const getUsers = (status: UserStatus) => {
  const q = query(
    paths.users.collection(),
    where("isClient", "==", true),
    orderBy("created_time", "desc")
  );
  if (status) {
    return query(q, where("status", "==", status));
  } else {
    return q;
  }
};

export const getUser = (userId: string) => {
  return paths.users.doc(userId);
};

export const updateUser = async (userId: string, data: FormUser) => {
  const userRef = paths.users.doc(userId);
  const updateData: FormUser = {
    display_name: data.display_name,
    photo_url: data.photo_url,
  };
  await updateDoc(userRef, updateData);
};
