import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyD_SKadRGDxh6q-oLm041BLo7FfrgO4lwc",
    authDomain: "atdnce-737df.firebaseapp.com",
    projectId: "atdnce-737df",
    storageBucket: "atdnce-737df.appspot.com",
    messagingSenderId: "862608589315",
    appId: "1:862608589315:web:5aab998f1111e6ab730436",
    measurementId: "G-XCGF7500ZP"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  const navigate = useNavigate();
  if (!user) {
     
      navigate("/login");
  }
});

export { auth }