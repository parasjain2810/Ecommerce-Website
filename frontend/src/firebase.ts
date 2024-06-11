

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDGc1Gab2IdD7hnydxsYq89Ips7JZ3gt08",
  authDomain: "jain-ecommerce-a01c3.firebaseapp.com",
  projectId: "jain-ecommerce-a01c3",
  storageBucket: "jain-ecommerce-a01c3.appspot.com",
  messagingSenderId: "949246076816",
  appId: "1:949246076816:web:c0ba9f0fe5d0bc6886f515"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);