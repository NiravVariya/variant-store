import { firestore } from "@/firebase/client";
import { collection, doc } from "firebase/firestore";

const getPaths = (path: string) => {
  return {
    doc: (id: string) => doc(firestore, `${path}/${id}`),
    collection: () => collection(firestore, path),
    new: () => doc(collection(firestore, path)),
  };
};

const getSubPaths = (parentPath: string, subPath: string) => {
  return {
    new: (parentId: string) =>
      doc(collection(firestore, parentPath, parentId, subPath)),
    collection: (parentId: string) =>
      collection(firestore, parentPath, parentId, subPath),
    doc: (parentId: string, subId: string) =>
      doc(firestore, parentPath, parentId, subPath, subId),
  };
};

const paths = {
  users: {
    ...getPaths("users"),
    subscriptions: {
      ...getSubPaths("users", "subscriptions"),
    },
  },
  packages: {
    ...getPaths("packages"),
  },
};

export default paths;
