import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"

import {
  doc,
  getDoc,
} from "firebase/firestore"

import {
  auth,
  db,
} from "../firebase"
import {
  collection,
  onSnapshot,
} from "firebase/firestore"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Dashboard() {
 const [rol, setRol] = useState("")
 const [totalCotizaciones,
  setTotalCotizaciones] =
  useState(0)

const [montoTotal,
  setMontoTotal] =
  useState(0)
 const [cotizaciones, setCotizaciones] =
  useState([])

const [totalFinanciado, setTotalFinanciado] =
  useState(0)

const [clientes, setClientes] =
  useState(0)
  const [rankingVendedores,
  setRankingVendedores] =
  useState([])
  const [ultimaCotizacion,
  setUltimaCotizacion] =
  useState(null)
  const [mostrarNotificacion,
  setMostrarNotificacion] =
  useState(false)
  const [cotizacionesHoy,
  setCotizacionesHoy] =
  useState(0)
  const datosGrafica = [
  {
    nombre: "Cotizaciones",
    total: cotizaciones.length,
  },

  {
    nombre: "Clientes",
    total: clientes,
  },

  {
    nombre: "Equipos",
    total: cotizaciones.length,
  },
]

useEffect(() => {
  const unsubscribe =
    auth.onAuthStateChanged((user) => {
      if (user) {
  obtenerRol(user)
  const obtenerCotizaciones = async (
  user
) => {
  
    onSnapshot(
  collection(db, "cotizaciones"),
  (querySnapshot) => {

    const datos = []

    let total = 0

    const doctores = new Set()
    const vendedores = {}
let cotizacionesHoy = 0

const hoy =
  new Date()
    .toLocaleDateString()
    querySnapshot.forEach((doc) => {
      
      const data = doc.data()
      const fecha =
  new Date(
    data.fecha
  ).toLocaleDateString()

if (fecha === hoy) {
  cotizacionesHoy++
}

      const usuarioActual =
  user.email
    .split("@")[0]
    .toLowerCase()

const esAdmin =
  usuarioActual === "alexis"

if (
  esAdmin ||
  data.usuario === user.email
) {
        datos.push(data)
        const vendedor =
  data.usuario
    ?.split("@")[0]

if (!vendedores[vendedor]) {
  vendedores[vendedor] = 0
}

vendedores[vendedor] +=
  data.totalFinalCliente || 0

        total +=
          data.totalFinalCliente || 0

        doctores.add(data.doctor)
      }
    })
setCotizacionesHoy(
  cotizacionesHoy
)
    setCotizaciones(datos)
    if (
  datos.length > 0 &&
  ultimaCotizacion?.doctor !==
    datos[0].doctor
) {
  setUltimaCotizacion(datos[0])
  setMostrarNotificacion(true)

setTimeout(() => {
  setMostrarNotificacion(false)
}, 4000)
}

    setTotalFinanciado(total)

    setClientes(doctores.size)
    const ranking =
  Object.entries(vendedores)
    .map(([nombre, total]) => ({
      nombre,
      total,
    }))
    .sort(
      (a, b) =>
        b.total - a.total
    )

setRankingVendedores(ranking)

})
  
}
  obtenerCotizaciones(user)
}
    })

  return () => unsubscribe()
}, [])

const obtenerRol = async (user) => {
  try {
    const usuario =
      user.email.split("@")[0].toLowerCase()

    const docRef = doc(
      db,
      "usuarios",
      usuario
    )

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setRol(docSnap.data().rol)
    } else {
      setRol("vendedor")
    }
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
            fontSize:
              window.innerWidth < 768
                ? "32px"
                : "50px",
            marginBottom: "10px",
          }}
        >
          Dashboard 📊
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "40px",
            fontSize: "18px",
          }}
        >
          Bienvenido {rol === "admin"
  ? "Administrador 👨‍💼"
  : "Vendedor 👨‍💻"}
        </p>
        {mostrarNotificacion && (
  <div
    style={{
      backgroundColor: "#2563eb",
      color: "white",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      fontWeight: "bold",
      animation:
        "pulse 1s infinite",
    }}
  >
    Nueva cotización recibida 🚀
  </div>
)}
{ultimaCotizacion && (
  <div
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "30px",
      fontWeight: "bold",
    }}
  >
    🔔 Última cotización:
    {" "}
    {ultimaCotizacion.doctor}
    {" "}
    - $
    {ultimaCotizacion.totalFinalCliente?.toLocaleString()}
  </div>
)}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth < 768
                ? "1fr"
                : "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          
          <Card
  titulo="Cotizaciones"
  valor={cotizaciones.length}
  emoji="💰"
/>

         <Card
  titulo="Clientes"
  valor={clientes}
  emoji="👨‍⚕️"
/>

          <Card
  titulo="Equipos"
  valor={cotizaciones.length}
  emoji="📦"
/>

          <Card
  titulo="Financiamiento"
  valor={`$${totalFinanciado.toLocaleString()}`}
  emoji="📈"
/>
        </div>

        <div
          style={{
            marginTop: "40px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#013970",   
              marginBottom: "20px",
            }}
          >
            Actividad reciente
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={tableStyle}>
                  Doctor
                </th>

                <th style={tableStyle}>
                  Producto
                </th>

                <th style={tableStyle}>
                  Total
                </th>
              </tr>
            </thead>

           <tbody>
  {cotizaciones
    .slice(0, 5)
    .map((cotizacion, index) => (
      <tr key={index}>
        <td style={tableStyle}>
          {cotizacion.doctor}
        </td>

        <td style={tableStyle}>
          {cotizacion.producto}
        </td>

        <td style={tableStyle}>
          $
          {cotizacion.totalFinalCliente?.toLocaleString()}
        </td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
        <div
  style={{
    marginTop: "40px",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "30px",
    height: "400px",
  }}
>
  <h2
    style={{
      color: "#013970",
      marginBottom: "20px",
    }}
  >
    Estadísticas 📈
  </h2>

  <ResponsiveContainer
    width="100%"
    height="85%"
  >
    <BarChart data={datosGrafica}>
      <XAxis dataKey="nombre" />

      <YAxis />

      <Tooltip />

      <Bar dataKey="total" />
    </BarChart>
  </ResponsiveContainer>
</div>
<div
  style={{
    marginTop: "40px",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "30px",
  }}
>
  <h2
    style={{
      color: "#013970",
      marginBottom: "20px",
    }}
  >
    Mejores vendedores 🏆
  </h2>

  {rankingVendedores.map(
    (vendedor, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "15px 0",
          borderBottom:
            "1px solid #e2e8f0",
        }}
      >
        <strong>
          {vendedor.nombre}
        </strong>

        <span>
          $
          {vendedor.total.toLocaleString()}
        </span>
      </div>
    )
  )}
</div>
      </div>
    </div>
  )
}

function Card({ titulo, valor, emoji }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "35px",
        }}
      >
        {emoji}
      </div>

      <h3
        style={{
          color: "#64748b",
          marginTop: "15px",
        }}
      >
        {titulo}
      </h3>

      <h1
        style={{
          color: "#013970",
          marginTop: "10px",
        }}
      >
        {valor}
      </h1>
    </div>
  )
}

const tableStyle = {
  borderBottom: "1px solid #e2e8f0",
  padding: "15px",
  textAlign: "left",
  color: "#0f172a",
}