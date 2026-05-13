import { addDoc, collection } from "firebase/firestore"
import {
  getDocs,
} from "firebase/firestore"

import {
  useEffect,
} from "react"

import { db, auth } from "../firebase"
import { useState } from "react"
import jsPDF from "jspdf"
import Sidebar from "../components/Sidebar"

export default function Cotizador() {
 const [productos, setProductos] =
  useState([])

  const [productoSeleccionado,
  setProductoSeleccionado] =
  useState({})
    useState(productos[0])

  const [precioFinal, setPrecioFinal] = useState(
    0
  )

  const [enganche, setEnganche] = useState(30)
  const [meses, setMeses] = useState(12)
  const [doctor, setDoctor] = useState("")
const [telefono, setTelefono] = useState("")
const [correoDoctor, setCorreoDoctor] = useState("")
const [hospital, setHospital] = useState("")
const [estado, setEstado] = useState("")
const [ciudad, setCiudad] = useState("")
const [comentarios, setComentarios] = useState("")
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
      datos.push(doc.data())
    })

    setProductos(datos)

    if (datos.length > 0) {
      setProductoSeleccionado(datos[0])

      setPrecioFinal(datos[0].precio)
    }
  } catch (error) {
    console.error(error)
  }
}

  const interes = meses === 6 ? 0.15 : 0.20

  const montoEnganche = (precioFinal * enganche) / 100

  const montoFinanciado = precioFinal - montoEnganche
  const engancheIdeal = precioFinal * 0.5

const faltanteEnganche =
  engancheIdeal - montoEnganche > 0
    ? engancheIdeal - montoEnganche
    : 0

  const totalConInteres = montoFinanciado * (1 + interes)
  const totalFinalCliente =
  totalConInteres + montoEnganche

  const mensualidad = totalConInteres / meses
  
  const guardarCotizacion = async () => {
  try {
    await addDoc(
  collection(db, "cotizaciones"),
  {
    usuario:
      auth.currentUser?.email || "sin usuario",

    doctor,
    telefono,
    correoDoctor,
    hospital,
    estado,
    ciudad,
    comentarios,

    producto:
      productoSeleccionado.nombre,

    precioFinal,

    enganche,

    meses,

    interes,

    mensualidad,

    totalFinalCliente,

    fecha: new Date(),
  }
)
    alert("Cotización guardada 😎")
  } catch (error) {
    console.error(error)

    alert("Error al guardar")
  }
}
const generarPDF = () => {
  const doc = new jsPDF()

  // LOGO
 const img = new Image()

img.src = "/logo.png"

img.onload = () => {
  doc.addImage(
    img,
    "PNG",
    15,
    10,
    40,
    20
  )
  const continuarPDF = () => {

  continuarPDF()
}

  // TITULO
  doc.setFontSize(22)

  doc.setTextColor(1, 57, 112)

  doc.text(
    "Cotización Financiera",
    105,
    50,
    null,
    null,
    "center"
  )

  // LINEA
  doc.setDrawColor(1, 57, 112)

  doc.line(15, 55, 195, 55)

  // DATOS CLIENTE
  doc.setFontSize(14)

  doc.setTextColor(0, 0, 0)

  doc.text(
    `Doctor: ${doctor}`,
    20,
    70
  )

  doc.text(
    `Hospital: ${hospital}`,
    20,
    80
  )

  doc.text(
    `Teléfono: ${telefono}`,
    20,
    90
  )

  doc.text(
    `Correo: ${correoDoctor}`,
    20,
    100
  )

  // BARRA AZUL
  doc.setFillColor(1, 57, 112)

  doc.rect(15, 115, 180, 10, "F")

  doc.setTextColor(255, 255, 255)

  doc.text(
    "Detalle Financiero",
    20,
    122
  )

  // DATOS FINANCIEROS
  doc.setTextColor(0, 0, 0)

  doc.text(
    `Producto: ${productoSeleccionado.nombre}`,
    20,
    140
  )

  doc.text(
    `Precio negociado: ${formatoMXN(precioFinal)}`,
    20,
    150
  )

  doc.text(
    `Enganche: ${enganche}%`,
    20,
    160
  )

  doc.text(
    `Plazo: ${meses} meses`,
    20,
    170
  )

  doc.text(
    `Mensualidad: ${formatoMXN(mensualidad)}`,
    20,
    180
  )

  // TOTAL FINAL
  doc.setFontSize(18)

  doc.setTextColor(22, 163, 74)

  doc.text(
    `Total final: ${formatoMXN(totalFinalCliente)}`,
    20,
    200
  )

  // FOOTER
  doc.setFontSize(11)

  doc.setTextColor(120)

  doc.text(
    "Endosalud / Fuji Film ©",
    20,
    280
  )

  doc.save(
    `Cotizacion-${doctor}.pdf`
  )
  }
}
  const formatoMXN = (numero) => {
  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  })
}

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft:
  window.innerWidth < 768
    ? "0"
    : "190px",
          padding: window.innerWidth < 768 ? "20px" : "40px",
          backgroundColor: "#013970",
          minHeight: "100vh",
        }}
      >
        <h1
  style={{
    color: "white",
    fontSize: window.innerWidth < 768 ? "30px" : "50px",
    marginBottom: "30px",
    textAlign: "center",
    width: "100%",
    marginTop: window.innerWidth < 768 ? "50px" : "0",
  }}
>
  Cotizador 💰
</h1>

        <div
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "30px",
            maxWidth: "700px",
maxWidth: "700px",
width: window.innerWidth < 768 ? "90%" : "100%",
margin: "0 auto",
          }}
        >
          <h2>{productoSeleccionado.nombre}</h2>
<h2
  style={{
    color: "#013970",
    marginBottom: "20px",
  }}
>
  Datos del doctor 👨‍⚕️
</h2>

<input
  type="text"
  placeholder="Nombre del doctor"
  value={doctor}
  onChange={(e) => setDoctor(e.target.value)}
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Teléfono"
  value={telefono}
  onChange={(e) => setTelefono(e.target.value)}
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Correo"
  value={correoDoctor}
  onChange={(e) => setCorreoDoctor(e.target.value)}
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Hospital"
  value={hospital}
  onChange={(e) => setHospital(e.target.value)}
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Estado"
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Ciudad"
  value={ciudad}
  onChange={(e) => setCiudad(e.target.value)}
  style={inputStyle}
/>

<textarea
  placeholder="Comentarios"
  value={comentarios}
  onChange={(e) => setComentarios(e.target.value)}
  style={{
    ...inputStyle,
    minHeight: "120px",
  }}
/>
          <label style={{ color: "#0f172a", fontWeight: "bold" }}>
  Producto
</label>

          <select
            value={productoSeleccionado.nombre}
            onChange={(e) => {
              const producto = productos.find(
                (p) => p.nombre === e.target.value
              )

              setProductoSeleccionado(producto)
              setPrecioFinal(producto.precio)
            }}
            style={inputStyle}
          >
            {productos.map((producto) => (
              <option
                key={producto.nombre}
                value={producto.nombre}
              >
                {producto.nombre}
              </option>
            ))}
          </select>

          <label style={{ color: "#0f172a", fontWeight: "bold" }}>
  Precio negociado
</label>

          <input
  type="text"
  value={formatoMXN(precioFinal)}
  onChange={(e) => {
    const valor = e.target.value.replace(/\D/g, "")
    setPrecioFinal(Number(valor))
  }}
  style={inputStyle}
/>

          <label style={{ color: "#0f172a", fontWeight: "bold" }}>
  Enganche
</label>

          <input
  type="text"
  value={`${enganche}%`}
  onChange={(e) => {
    const valor = e.target.value.replace(/\D/g, "")
    setEnganche(Number(valor))
  }}
  style={inputStyle}
/>

          <label style={{ color: "#0f172a", fontWeight: "bold" }}>
  Plazo
</label>

          <select
            value={meses}
            onChange={(e) =>
              setMeses(Number(e.target.value))
            }
            style={inputStyle}
          >
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>

          <div
  style={{
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    color: "#0f172a",
  }}
>
            <h3>
              Enganche: $
              {montoEnganche.toLocaleString()}
            </h3>
<h3>
  Enganche ideal (50%): $
  {engancheIdeal.toLocaleString()}
</h3>

<h3>
  Faltante para 50%: $
  {faltanteEnganche.toLocaleString()}
</h3>

<h3>
  Interés aplicado:
  {(interes * 100).toFixed(0)}%
</h3>
            <h3>
              Monto financiado: $
              {montoFinanciado.toLocaleString()}
            </h3>

            <h3>
              Total con interés: $
              {totalConInteres.toLocaleString()}
            </h3>
<h2
  style={{
    color: "#16a34a",
    marginTop: "20px",
  }}
>
  Total final cliente: $
  {totalFinalCliente.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}
</h2>
            <h2>
  Mensualidad: $
  {mensualidad.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}
</h2>

<button
  onClick={guardarCotizacion}
  style={{
    marginTop: "20px",
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#013970",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  }}
>
  Guardar cotización 💾
</button>

<button
  onClick={generarPDF}
  style={{
    marginTop: "15px",
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#16a34a",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  }}
>
  Generar PDF 📄
</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "15px",
  marginTop: "10px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  fontSize: "16px",
  outline: "none",
}