import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { initializeApp } from "firebase/app"




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
setPersistence(
  auth,
  browserLocalPersistence
)

import {
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore"
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
export { db }