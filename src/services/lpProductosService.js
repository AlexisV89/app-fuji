import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

import { db } from "../firebase"

export const agregarProducto = async (producto) => {

  await addDoc(
    collection(db, "LPProductos"),
    producto
  )

}