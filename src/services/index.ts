import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export function dataFromSnapshot(snapshot: QueryDocumentSnapshot) {
  if (!snapshot.exists()) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return { ...data, id: snapshot.id };
}
