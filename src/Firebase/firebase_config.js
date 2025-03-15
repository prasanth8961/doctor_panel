import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2CLn3qquqk86v9hzL4-MBptvfLz7R0J0",
  authDomain: "drugdispenser-mz.firebaseapp.com",
  databaseURL: "https://drugdispenser-mz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "drugdispenser-mz",
  storageBucket: "drugdispenser-mz.firebasestorage.app",
  messagingSenderId: "275245012580",
  appId: "1:275245012580:web:4a10412a5439cf3af97171"
};


export const app = initializeApp(firebaseConfig);


