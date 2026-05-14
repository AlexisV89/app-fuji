import { Navigate } from "react-router-dom"

import { auth } from "../firebase"

export default function ProtectedRoute({
  children,
}) {
  const usuario = auth.currentUser

  if (!usuario) {
    return <Navigate to="/login" />
  }

  return children
}