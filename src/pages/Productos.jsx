import {
  useEffect,
  useState,
} from "react"

import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
doc,
deleteDoc,
} from "firebase/firestore"

import {
  db,
} from "../firebase"

import Sidebar from "../components/Sidebar"

export default function Productos() {
  const [productos, setProductos] =
    useState([])

  const [nombre, setNombre] =
    useState("")

  const [precio, setPrecio] =
    useState("")

  useEffect(() => {
    obtenerProductos()
  }, [])

  const obtenerProductos = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "productos")
      )

      const datos = []

      querySnapshot.forEach((doc) => {
        datos.push({
  id: doc.id,
  ...doc.data(),
})
datos.sort(
  (a, b) =>
    b.fecha?.seconds -
    a.fecha?.seconds
)
      })

      setProductos(datos)
    } catch (error) {
      console.error(error)
    }
  }

  const agregarProducto = async () => {
    try {
      await addDoc(
        collection(db, "productos"),
        {
          nombre,
          precio: Number(precio),
          activo: true,
        }
      )

      setNombre("")
      setPrecio("")

      obtenerProductos()

      alert("Producto agregado 😎")
    } catch (error) {
      console.error(error)
    }
  }
  const editarPrecio = async (
  id,
  nuevoPrecio
) => {
  try {
    const docRef = doc(
      db,
      "productos",
      id
    )

    await updateDoc(docRef, {
      precio: Number(nuevoPrecio),
    })

    obtenerProductos()

    alert("Precio actualizado 😎")
  } catch (error) {
    console.error(error)
  }
}
const eliminarProducto = async (
  id
) => {
  try {
    await deleteDoc(
      doc(db, "productos", id)
    )

    obtenerProductos()

    alert("Producto eliminado 🗑️")
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
    : "190px",
          padding:
            window.innerWidth < 768
              ? "90px 20px 20px"
              : "40px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: "30px",
          }}
        >
          Productos 📦
        </h1>

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Nombre producto"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) =>
              setPrecio(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={agregarProducto}
            style={buttonStyle}
          >
            Agregar producto
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {productos.map((producto, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              <h2
                style={{
                  color: "#013970",
                }}
              >
                {producto.nombre}
              </h2>

             <input
  type="number"
  defaultValue={producto.precio}
  onBlur={(e) =>
    editarPrecio(
      producto.id,
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    marginTop: "10px",
  }}
/>
<button
  onClick={() =>
    eliminarProducto(producto.id)
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
    fontSize: "15px",
  }}
>
  Eliminar producto 🗑️
</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box",
}

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#013970",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
}