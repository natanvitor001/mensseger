// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCI8_EwAA7r7ZrQnC7ib1F5XyRrk_Bu4x0",
  authDomain: "projeto-app-mensagem.firebaseapp.com",
  projectId: "projeto-app-mensagem",
  storageBucket: "projeto-app-mensagem.appspot.com",
  messagingSenderId: "395148854589",
  appId: "1:395148854589:web:a800caed4517b36191b154",
  measurementId: "G-0GF07WLKN7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
