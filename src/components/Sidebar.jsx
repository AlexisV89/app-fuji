import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { useEffect, useState } from "react"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  db,
} from "../firebase"

import { auth } from "../firebase"

import { useNavigate } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()
  const [rol, setRol] = useState("")

useEffect(() => {
  obtenerRol()
}, [])

const obtenerRol = async () => {
  try {
    const usuario =
      auth.currentUser?.email
        ?.split("@")[0]
        .toLowerCase()

    const docRef = doc(
      db,
      "usuarios",
      usuario
    )

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setRol(docSnap.data().rol)
    }
  } catch (error) {
    console.error(error)
  }
}
  

const cerrarSesion = async () => {
  await signOut(auth)

  navigate("/login")
}
  const [open, setOpen] = useState(false)

 const isMobile =
  window.innerWidth < 768

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1000,
            backgroundColor: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 15px",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      <div
        style={{
          width: isMobile ? "220px" : "190px",
          height: "100vh",
          backgroundColor: "#0f172a",
          color: "white",
          padding: "15px",
          position: "fixed",
          left: isMobile
            ? open
              ? "0"
              : "-250px"
            : "0",
          top: 0,
          transition: "0.3s",
          zIndex: 999,
        }}
      >
        <h2>APP FUJI 🚀</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <Link to="/dashboard" style={linkStyle}>
            Dashboard
          </Link>

          <Link to="/cotizador" style={linkStyle}>
            Cotizador
          </Link>
          <Link
  to="/cotizaciones"
  style={linkStyle}
>
  Cotizaciones
</Link>
<Link
  to="/lp-productos"
  style={linkStyle}
>
  📦 LP Productos
</Link>

{rol === "admin" && (
  <Link
    to="/productos"
    style={linkStyle}
    
  >
    Productos
  </Link>
)}

{rol === "admin" && (
  <Link
    to="/usuarios"
    style={linkStyle}
  >
    Usuarios
  </Link>
)}
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
          <button
  onClick={cerrarSesion}
  style={{
    marginTop: "30px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  Cerrar sesión 🚪
</button>
          
        </nav>
      </div>
    </>
  )
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
}