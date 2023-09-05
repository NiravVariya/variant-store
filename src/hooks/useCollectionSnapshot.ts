import { onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { dataFromSnapshot } from "../services";

interface UseCollectionSnapshot {
  query: () => any;
  dataHandler: (data: any) => void;
  errorHandler: (error: Error) => void;
  deps: any[];
}

export default function useCollectionSnapshot({ query, dataHandler, errorHandler, deps = [] }: UseCollectionSnapshot) {
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(),
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((doc) => dataFromSnapshot(doc));
        dataHandler(docs);
      },
      (error: Error) => errorHandler(error)
    );

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
