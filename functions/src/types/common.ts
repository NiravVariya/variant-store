import * as admin from "firebase-admin";

export type Timestamp = admin.firestore.Timestamp;
export type DocumentReference = admin.firestore.DocumentReference;

export type Id = {
  id: string;
};
