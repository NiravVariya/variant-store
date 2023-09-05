import { dataFromSnapshot } from "@/services/index";
import { DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

type UseDocumentSnapshot<T> = {
  docRef: DocumentReference;
  dataHandler: (data: T) => void;
  errorHandler: (error: Error) => void;
  deps?: any[];
};

export default function useDocumentSnapshot<T>({ docRef, dataHandler, errorHandler, deps = [] }: UseDocumentSnapshot<T>) {
  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        dataHandler(dataFromSnapshot(snapshot) as T);
      },
      (error) => errorHandler(error)
    );

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
