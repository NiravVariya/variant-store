import { DocumentReference } from "firebase/firestore";
import { useState } from "react";
import useDocumentSnapshot from "./useDocumentSnapshot";

export default function useDocumentFetch<T>(path: (docId: string) => DocumentReference, documentId: string): [T, boolean, Error] {
  const [documentLoading, setDocumentLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [documentError, setDocumentError] = useState(null);

  useDocumentSnapshot({
    docRef: path(documentId),
    dataHandler: (document) => {
      setDocument(document);
      setDocumentError(null);
      setDocumentLoading(false);
    },
    errorHandler: (error) => {
      setDocumentError(error);
      setDocumentLoading(false);
    },
    deps: [documentId],
  });
  return [document, documentLoading, documentError];
}
