import { Navigate } from "react-router-dom"

import { auth, db } from "../firebase"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  useEffect,
  useState,
} from "react"

export default function AdminRoute({
  children,
}) {
  const [loading, setLoading] =
    useState(true)

  const [esAdmin, setEsAdmin] =
    useState(false)

  useEffect(() => {
    verificarRol()
  }, [])

  const verificarRol =
    async () => {
      try {
        const email =
          auth.currentUser?.email

        const usuario =
          email
            ?.split("@")[0]
            .toLowerCase()

        const docRef = doc(
          db,
          "usuarios",
          usuario
        )

        const docSnap =
          await getDoc(docRef)

        if (
          docSnap.exists() &&
          docSnap.data().rol ===
            "admin"
        ) {
          setEsAdmin(true)
        }
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    }

  if (loading) {
    return <h1>Cargando...</h1>
  }

  if (!esAdmin) {
    return (
      <Navigate to="/dashboard" />
    )
  }

  return children
}