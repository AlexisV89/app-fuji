import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
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
  
  const guardarCotizacion = async (e) => {
  e?.preventDefault()
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
const generarPDF = async () => {
  const pdf = new jsPDF()
  const usuarioActual =
  auth.currentUser?.email
    ?.split("@")[0]
    ?.toLowerCase()

const usuarioRef = doc(
  db,
  "usuarios",
  usuarioActual
)

const usuarioSnap =
  await getDoc(usuarioRef)

let nombreVendedor = ""
let correoVendedor = ""
let telefonoVendedor = ""

if (usuarioSnap.exists()) {
  nombreVendedor =
    usuarioSnap.data().nombre || ""

  correoVendedor =
  usuarioSnap.data().correo || ""

  telefonoVendedor =
    usuarioSnap.data().telefono || ""
}

  // LOGO
 const img = new Image()

img.src = "/logo.png"

img.onload = () => {

  pdf.addImage(
    img,
    "PNG",
    15,
    10,
    40,
    20
  )
  

  // TITULO
  pdf.setFontSize(22)

  pdf.setTextColor(1, 57, 112)

  pdf.text(
    "Cotización Financiera",
    105,
    50,
    null,
    null,
    "center"
  )
const fechaActual =
  new Date().toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  )

pdf.setFontSize(12)

pdf.setTextColor(0, 0, 0)

pdf.text(
  `Fecha: ${fechaActual}`,
  150,
  70
)
  // LINEA
  pdf.setDrawColor(1, 57, 112)

  pdf.line(15, 55, 195, 55)

  // DATOS CLIENTE
  pdf.setFontSize(14)

  pdf.setTextColor(0, 0, 0)

  pdf.text(
    `Doctor: ${doctor}`,
    20,
    70
  )

  pdf.text(
    `Hospital: ${hospital}`,
    20,
    80
  )

  pdf.text(
    `Teléfono: ${telefono}`,
    20,
    90
  )

  pdf.text(
    `Correo: ${correoDoctor}`,
    20,
    100
  )

  // BARRA AZUL
  pdf.setFillColor(1, 57, 112)

  pdf.rect(15, 115, 180, 10, "F")

  pdf.setTextColor(255, 255, 255)

  pdf.text(
    "Detalle Financiero",
    20,
    122
  )

  // DATOS FINANCIEROS
  pdf.setTextColor(0, 0, 0)

  pdf.text(
  pdf.splitTextToSize(
    `Producto: ${productoSeleccionado.nombre}`,
    70
  ),
  20,
  140
)

  pdf.text(
    `Precio negociado: ${formatoMXN(precioFinal)}`,
    20,
    150
  )

  pdf.text(
    `Enganche: ${enganche}%`,
    20,
    160
  )

  pdf.text(
    `Plazo: ${meses} meses`,
    20,
    170
  )

  pdf.text(
    `Mensualidad: ${formatoMXN(mensualidad)}`,
    20,
    180
  )
// CUADRO FINANCIERO

pdf.setDrawColor(180)

pdf.rect(
  110,
  130,
  80,
  65
)

pdf.setFontSize(12)

pdf.text(
  `Monto enganche: ${formatoMXN(montoEnganche)}`,
  115,
140
)
pdf.setFontSize(14)

pdf.setTextColor(
  1,
  57,
  112
)

pdf.text(
  "Resumen Financiero",
  105,
  122
)
pdf.text(
  `Monto financiado: ${formatoMXN(montoFinanciado)}`,
  115,
152
)

pdf.text(
  `Interés aplicado: ${formatoMXN(
    montoFinanciado * interes
  )}`,
  115,
164
)

pdf.text(
  `Total antes IVA: ${formatoMXN(
    totalFinalCliente
  )}`,
  115,
176
)

pdf.text(
  `IVA (16%): ${formatoMXN(
    totalFinalCliente * 0.16
  )}`,
  115,
  188
)
pdf.setFillColor(
  16,
  185,
  129
)

pdf.rect(
  100,
  195,
  90,
  15,
  "F"
)

pdf.setTextColor(
  255,
  255,
  255
)

pdf.setFontSize(14)

pdf.text(
  `Total con IVA: ${formatoMXN(
    totalFinalCliente * 1.16
  )}`,
  115,
  205
)


  // FOOTER
  pdf.setFontSize(11)

  pdf.setTextColor(120)

  pdf.setFillColor(
  1,
  57,
  112
)

pdf.rect(
  0,
  290,
  210,
  10,
  "F"
)

pdf.setTextColor(
  255,
  255,
  255
)

pdf.setFontSize(10)

pdf.text(
  "Endosalud | FujiFilm | APP FUJI",
  60,
  296
)
pdf.setFontSize(12)

pdf.setTextColor(0, 0, 0)

pdf.text(
  "--------------------------------",
  20,
  245
)
pdf.setDrawColor(
  1,
  57,
  112
)

pdf.rect(
  15,
  220,
  180,
  50
)

pdf.setFillColor(
  1,
  57,
  112
)

pdf.rect(
  15,
  235,
  180,
  10,
  "F"
)

pdf.setTextColor(
  255,
  255,
  255
)

pdf.setFontSize(13)

pdf.text(
  "Datos del Vendedor",
  20,
  232
)

pdf.setTextColor(
  0,
  0,
  0
)

pdf.setFontSize(11)

pdf.setDrawColor(120)

pdf.line(
  120,
  280,
  180,
  280
)

pdf.setFontSize(10)

pdf.setTextColor(80)

pdf.text(
  "Firma del vendedor",
  135,
  287
)
pdf.text(
  `Vendedor: ${nombreVendedor}`,
  20,
  250
)
pdf.text(
  `Correo: ${correoVendedor}`,
  20,
  260
)

pdf.text(
  `Teléfono: ${telefonoVendedor}`,
  20,
  270
)

pdf.text(
  "APP FUJI / Endosalud",
  20,
  285
)
  pdf.save(
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
<h3
  style={{
    color: "#f59e0b",
    marginTop: "10px",
  }}
>
  IVA (16%): $
  {(totalFinalCliente * 0.16).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  )}
</h3>

<h2
  style={{
    color: "#dc2626",
    marginTop: "10px",
  }}
>
  Total + IVA: $
  {(totalFinalCliente * 1.16).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  )}
</h2>
<button
  type="button"
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