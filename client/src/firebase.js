// ahmed hossam file
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAfjEpfQDRNc9umJR_kJ-mFlAz_9o66r-U",
  authDomain: "website-fc3b1.firebaseapp.com",
  databaseURL: "https://website-fc3b1-default-rtdb.firebaseio.com",
  projectId: "website-fc3b1",
  storageBucket: "website-fc3b1.appspot.com",
  messagingSenderId: "625674850044",
  appId: "1:625674850044:web:c56fb318f5cd1de2e8d179"
};

const firebaseApp=initializeApp(firebaseConfig);
let db=getFirestore(firebaseApp)
export {db};

// my imports 
// npm install @emailjs/browser

// npm install react-icons

// npm install moment

// npm install react-html-parser

//npm install buffer
// go to webpack.config.dev and webpack.config files and add: 
// fallback: {
//       "buffer": require.resolve("buffer/")
//     }
// add it in resolve