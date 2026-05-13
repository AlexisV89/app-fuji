import { initializeApp } from "firebase/app"

import { getAuth } from "firebase/auth"

import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBBLebE5K333CAmXdc0nqHSTnnoCVUeBwM",
  authDomain: "inventarioendosalud.firebaseapp.com",
  projectId: "inventarioendosalud",
  storageBucket: "inventarioendosalud.firebasestorage.app",
  messagingSenderId: "784806669315",
  appId: "1:784806669315:web:c7bddefa27408eb37db236",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)