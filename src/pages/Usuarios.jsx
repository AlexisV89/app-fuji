import {
  useEffect,
  useState,
} from "react"

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

import { db } from "../firebase"

import Sidebar from "../components/Sidebar"

export default function Usuarios() {
  const [usuarios, setUsuarios] =
    useState([])

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const obtenerUsuarios =
    async () => {
      try {
        const querySnapshot =
          await getDocs(
            collection(
              db,
              "usuarios"
            )
          )

        const datos = []

        querySnapshot.forEach(
          (documento) => {
            datos.push({
              id: documento.id,
              ...documento.data(),
            })
          }
        )

        setUsuarios(datos)
      } catch (error) {
        console.error(error)
      }
    }

  const cambiarRol = async (
    id,
    nuevoRol
  ) => {
    try {
      const docRef = doc(
        db,
        "usuarios",
        id
      )

      await updateDoc(docRef, {
        rol: nuevoRol,
      })

      obtenerUsuarios()

      alert("Rol actualizado 😎")
    } catch (error) {
      console.error(error)
    }
  }
  const eliminarUsuario =
  async (id) => {
    const confirmar =
      window.confirm(
        "¿Eliminar usuario?"
      )

    if (!confirmar) return

    try {
      await deleteDoc(
        doc(
          db,
          "usuarios",
          id
        )
      )

      obtenerUsuarios()

      alert("Usuario eliminado 😎")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#013970",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          
          marginLeft:
  window.innerWidth < 768
    ? "0"
    : "220px",
          padding:
            window.innerWidth < 768
              ? "90px 20px 20px"
              : "40px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize:
              window.innerWidth < 768
                ? "32px"
                : "50px",
            marginBottom: "30px",
          }}
        >
          Usuarios 👨‍💼
        </h1>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {usuarios.map(
            (usuario) => (
              <div
                key={usuario.id}
                style={{
                  backgroundColor:
                    "white",

                  borderRadius:
                    "20px",

                  padding: "25px",

                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  style={{
                    color:
                      "#013970",
                  }}
                >
                  {usuario.usuario}
                </h2>

                <p>
                  📧{" "}
                  {usuario.correo}
                </p>

                <select
                  value={usuario.rol}
                  onChange={(e) =>
                    cambiarRol(
                      usuario.id,
                      e.target.value
                    )
                  }
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  <option value="admin">
                    Admin
                  </option>

                  <option value="vendedor">
                    Vendedor
                  </option>
                </select>
                <button
  onClick={() =>
    eliminarUsuario(usuario.id)
  }
  style={{
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Eliminar usuario 🗑️
</button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}