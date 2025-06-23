// 📄 src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// const vapidKey = "BCNnYNKkVWQv-R76qBQwBFZBm2ZnWoHb4AFEDqo9Ho4UgRP72JLFRfTvNIZnRWEurntT5nwYjXaNp_T2-K0pJpE";
export const vapidKey =
  "BCNnYNKkWvQv-R76qBQwBFZBm2ZnWoHb4AFEDqo9Ho4ugRP72JLFRfTvNIZnRWEurntT5nwYjXaNp_T2-K0pJpE";
const firebaseConfig = {
  apiKey: "AIzaSyAZGIAs5agJk5HH_LGidkhX-ZkTG1Rh_I0",
  authDomain: "smartvax-fcm.firebaseapp.com",
  projectId: "smartvax-fcm",
  storageBucket: "smartvax-fcm.appspot.com", // ← ✅ هذا هو الصحيح
  messagingSenderId: "370407188316",
  appId: "1:370407188316:web:4b1d23dbc982cccd938399",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAZGIAs5agJk5HH_LGidkhX-ZkTG1Rh_I0",
//   authDomain: "smartvax-fcm.firebaseapp.com",
//   projectId: "smartvax-fcm",
//   storageBucket: "smartvax-fcm.firebasestorage.app",
//   messagingSenderId: "370407188316",
//   appId: "1:370407188316:web:4b1d23dbc982cccd938399"
// };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
