import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react"
import ModalProducto from "../components/ModalProducto"

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

import {
  db,
} from "../firebase"

export default function LPProductos() {
  const [seleccionados,
setSeleccionados] =
useState([])
  const [productoEditar,
setProductoEditar] =
useState(null)
  const [productos,
setProductos] =
useState([])
const [mostrarModal,
setMostrarModal] =
useState(false)
const [especialidad,
setEspecialidad] =
useState("")

const [codigo,
setCodigo] =
useState("")

const [producto,
setProducto] =
useState("")

const [entrega,
setEntrega] =
useState("")

const [precioConvenio,
setPrecioConvenio] =
useState("")

const [poliza,
setPoliza] =
useState("")

const [preventivos,
setPreventivos] =
useState("")
const [buscar,
setBuscar] =
useState("")
useEffect(() => {

const unsubscribe =
onSnapshot(

collection(
db,
"LPProductos"
),

(snapshot) => {

const lista = []

snapshot.forEach((doc) => {

lista.push({
id: doc.id,
...doc.data(),
})

})

setProductos(lista)
console.log(lista)

}

)

return () => unsubscribe()

}, [])
const guardarProducto = async () => {

  if (
    !especialidad ||
    !codigo ||
    !producto
  ) {
    alert("Completa los campos obligatorios")
    return
  }
  
  try {

    const datos = {

especialidad,

codigo,

producto,

entrega,

precioConvenio:Number(precioConvenio),

poliza:Number(poliza),

preventivos:Number(preventivos),

}
if (productoEditar) {

  await updateDoc(
    doc(
      db,
      "LPProductos",
      productoEditar.id
    ),
    datos
  )

} else {

  await addDoc(
    collection(
      db,
      "LPProductos"
    ),
    datos
  )

}


    alert(
  productoEditar
    ? "Producto actualizado correctamente"
    : "Producto agregado correctamente"
)

    setEspecialidad("")
    setCodigo("")
    setProducto("")
    setEntrega("")
    setPrecioConvenio("")
    setPoliza("")
    setPreventivos("")

    setMostrarModal(false)
    setProductoEditar(null)

  } catch (error) {

    console.error(error)

    alert("Error al guardar")

  }

}
const eliminarProducto = async (id) => {

  const confirmar = window.confirm(
    "¿Deseas eliminar este producto?"
  )

  if (!confirmar) return

  try {

    await deleteDoc(
      doc(
        db,
        "LPProductos",
        id
      )
    )

    alert("Producto eliminado correctamente")

  } catch (error) {

    console.error(error)

    alert("Error al eliminar")

  }

}
const productosFiltrados = productos

.filter((item) => {

  const texto = buscar.toLowerCase()

  return (

    item.producto?.toLowerCase().includes(texto) ||

    item.codigo?.toLowerCase().includes(texto) ||

    item.especialidad?.toLowerCase().includes(texto)

  )

})

.sort((a, b) => {

  const especialidad =
    a.especialidad.localeCompare(
      b.especialidad
    )

  if (especialidad !== 0)
    return especialidad

  return a.codigo.localeCompare(
    b.codigo
  )

})
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
    marginLeft: "190px",
    padding: "40px",
    width: "calc(100% - 190px)",
    boxSizing: "border-box",
  }}
>
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          📦 LP Productos
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "18px",
          }}
        >
          Lista de precios y catálogo de equipos Fuji.
        </p>
        <div
  style={{
    backgroundColor: "white",
    marginTop: "35px",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,.15)",
    width: "100%",
    boxSizing: "border-box",
  }}
>

  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  }}
>
  <div>
    <h2
      style={{
        color: "#013970",
        margin: 0,
        fontSize: "30px",
      }}
    >
      Catálogo de Productos
    </h2>

    <p
      style={{
        color: "#64748b",
        marginTop: "8px",
      }}
    >
      Consulta la lista oficial de equipos Fuji.
    </p>
  </div>

  <div
  style={{
    display: "flex",
    gap: "15px",
    alignItems: "center",
  }}
>
  <div
    style={{
      background: "#013970",
      color: "white",
      padding: "10px 18px",
      borderRadius: "12px",
      fontWeight: "bold",
    }}
  >
    Total: {productos.length}
  </div>

  <button
    onClick={() => {

  setProductoEditar(null)

  setEspecialidad("")
  setCodigo("")
  setProducto("")
  setEntrega("")
  setPrecioConvenio("")
  setPoliza("")
  setPreventivos("")

  setMostrarModal(true)

}}
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    ➕ Agregar Producto
  </button>
</div>
</div>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>

  <input
    type="text"
    placeholder="🔍 Buscar producto, código o especialidad..."
    value={buscar}
    onChange={(e) =>
      setBuscar(e.target.value)
    }
    style={{
      width: "400px",
      padding: "12px 15px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "15px",
      outline: "none",
    }}
  />

</div>
<div
  style={{
    overflowX: "auto",
    marginTop: "25px",
  }}
>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          backgroundColor: "#013970",
          color: "white",
        }}
      >
        <th style={tableHeader}>
✓
</th>
        <th style={tableHeader}>Especialidad</th>
        <th style={tableHeader}>Código</th>
        <th style={tableHeader}>Producto</th>
        <th style={tableHeader}>Entrega</th>
        <th style={tableHeader}>Precio Convenio</th>
        <th style={tableHeader}>Póliza</th>
        <th style={tableHeader}>Preventivos</th>
        <th style={tableHeader}>Acciones</th>
      </tr>
    </thead>

    <tbody>
      {productosFiltrados.map((producto) => (
        <tr key={producto.id}>
          <td style={tableCell}>{producto.especialidad}</td>

          <td style={tableCell}>{producto.codigo}</td>

          <td style={tableCell}>{producto.producto}</td>

          <td style={tableCell}>{producto.entrega}</td>

          <td style={tableCell}>
            ${producto.precioConvenio?.toLocaleString()}
          </td>

          <td style={tableCell}>
            ${producto.poliza?.toLocaleString()}
          </td>

          <td style={tableCell}>
            {producto.preventivos}
          </td>
          <td style={tableCell}>
  <button
onClick={() => {

setProductoEditar(producto)

setEspecialidad(
producto.especialidad
)

setCodigo(
producto.codigo
)

setProducto(
producto.producto
)

setEntrega(
producto.entrega
)

setPrecioConvenio(
producto.precioConvenio
)

setPoliza(
producto.poliza
)

setPreventivos(
producto.preventivos
)

setMostrarModal(true)

}}
style={{
backgroundColor:"#2563eb",
color:"white",
border:"none",
padding:"8px 12px",
borderRadius:"8px",
cursor:"pointer",
marginRight:"8px",
}}
>

✏️

</button>

  <button
  onClick={() =>
    eliminarProducto(
      producto.id
    )
  }
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  🗑️
</button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
 {mostrarModal && (

<ModalProducto
  mostrarModal={mostrarModal}
  setMostrarModal={setMostrarModal}
  guardarProducto={guardarProducto}
  especialidad={especialidad}
  setEspecialidad={setEspecialidad}
  codigo={codigo}
  setCodigo={setCodigo}
  producto={producto}
  setProducto={setProducto}
  entrega={entrega}
  setEntrega={setEntrega}
  precioConvenio={precioConvenio}
  setPrecioConvenio={setPrecioConvenio}
  poliza={poliza}
  setPoliza={setPoliza}
  preventivos={preventivos}
  setPreventivos={setPreventivos}
  productoEditar={
productoEditar
}
/>


)}
</div>

</div>

      </div>
    </div>
  );
}
const tableHeader = {
  padding: "16px",
  textAlign: "left",
  fontWeight: "bold",
  color: "white",
}

const tableCell = {
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
  color: "#0f172a",
  backgroundColor: "white",
}
