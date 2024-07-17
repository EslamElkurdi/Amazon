import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfjEpfQDRNc9umJR_kJ-mFlAz_9o66r-U",
  authDomain: "website-fc3b1.firebaseapp.com",
  databaseURL: "https://website-fc3b1-default-rtdb.firebaseio.com",
  projectId: "website-fc3b1",
  storageBucket: "website-fc3b1.appspot.com",
  messagingSenderId: "625674850044",
  appId: "1:625674850044:web:c56fb318f5cd1de2e8d179"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app) 