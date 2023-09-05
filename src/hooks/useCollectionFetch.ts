import { useState } from "react";
import useCollectionSnapshot from "./useCollectionSnapshot";

export default function useCollectionFetch<T>(queryCallback: any, ...queryArgs: any): [Array<T>, boolean, Error?] {
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collections, setCollections] = useState(null);
  const [collectionsError, setCollectionsError] = useState(null);

  useCollectionSnapshot({
    query: () => queryCallback(...queryArgs),
    dataHandler: (collections: any) => {
      setCollections(collections);
      setCollectionLoading(false);
      setCollectionsError(null);
    },
    errorHandler: (error: any) => {
      setCollectionsError(error);
      setCollectionLoading(false);
    },
    deps: [...queryArgs],
  });

  return [collections, collectionLoading, collectionsError];
}
