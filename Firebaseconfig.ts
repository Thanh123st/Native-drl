import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDEHauvTuZaLsVIJfIQTPQJyit_klIYjN0",
    authDomain: "native-drl.firebaseapp.com",
    projectId: "native-drl",
    storageBucket: "native-drl.firebasestorage.app",
    messagingSenderId: "24151196837",
    appId: "1:24151196837:web:868bd46da0e18bdf99794c",
    measurementId: "G-GNTQXQDV07"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth();
signInAnonymously(auth)
  .then(() => console.log("Đã đăng nhập ẩn danh!"))
  .catch((error) => console.error("Lỗi đăng nhập:", error));