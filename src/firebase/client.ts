import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebaseConfig.json';

const config = firebaseConfig;

const firebaseApp = initializeApp(config);

export const firestore = getFirestore(firebaseApp);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);
