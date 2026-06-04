import jsPDF from "jspdf"

import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
} from "firebase/firestore"

import {
  auth,
  db,
} from "../firebase"

import Sidebar from "../components/Sidebar"

export default function Cotizaciones() {
  const [cotizaciones, setCotizaciones] =
    useState([])
    const [busqueda, setBusqueda] =
  useState("")
const descargarPDF = (
  cotizacion
) => {
  const pdf = new jsPDF()

  pdf.setFontSize(20)

  pdf.setTextColor(
    1,
    57,
    112
  )

  pdf.text(
    "Cotización Fuji",
    20,
    20
  )

  pdf.setFontSize(12)

  pdf.setTextColor(
    0,
    0,
    0
  )

  pdf.text(
    `${cotizacion.doctor}`,
    20,
    40
  )

  pdf.text(
    `Hospital: ${cotizacion.hospital}`,
    20,
    50
  )

  pdf.text(
    `Telefono: ${cotizacion.telefono}`,
    20,
    60
  )

  pdf.text(
    `Producto: ${cotizacion.producto}`,
    20,
    70
  )

  pdf.text(
    `Plazo: ${cotizacion.meses} meses`,
    20,
    80
  )

  pdf.text(
    `Total: $${cotizacion.totalFinalCliente?.toLocaleString()}`,
    20,
    90
  )

  pdf.text(
    `IVA (16%): $${(
      cotizacion.totalFinalCliente *
      0.16
    ).toLocaleString()}`,
    20,
    100
  )

  pdf.setFontSize(16)

  pdf.setTextColor(
    22,
    163,
    74
  )

  pdf.text(
    `Total + IVA: $${(
      cotizacion.totalFinalCliente *
      1.16
    ).toLocaleString()}`,
    20,
    120
  )

  pdf.save(
    `Cotizacion-${cotizacion.doctor}.pdf`
  )
}
  useEffect(() => {
    obtenerCotizaciones()
  }, [])

  const obtenerCotizaciones = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "cotizaciones")
      )

      const datos = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()

        if (
          data.usuario ===
          auth.currentUser?.email
        ) {
          datos.push({
            id: doc.id,
            ...data,
          })
        }
      })

      setCotizaciones(datos)
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
            marginBottom: "30px",
          }}
        >
          Cotizaciones 📄
          <input
  type="text"
  placeholder="Buscar doctor, hospital o producto..."
  value={busqueda}
  onChange={(e) =>
    setBusqueda(e.target.value)
  }
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    marginBottom: "25px",
    fontSize: "16px",
  }}
/>
        </h1>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {cotizaciones
  .filter((cotizacion) => {
    const texto =
      busqueda.toLowerCase()

    return (
      cotizacion.doctor
        ?.toLowerCase()
        .includes(texto) ||

      cotizacion.hospital
        ?.toLowerCase()
        .includes(texto) ||

      cotizacion.producto
        ?.toLowerCase()
        .includes(texto)
    )
  })
  .map((cotizacion, index) => (
            <div
  id={`cotizacion-${index}`}
  key={cotizacion.id}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <h2
  style={{
    color: "#013970",
    marginBottom: "15px",
    fontSize: "28px",
  }}
>
                {cotizacion.doctor}
              </h2>

              <p
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>

                📦 Producto:
                {" "}
                {cotizacion.producto}
              </p>

              <p
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>
                🏥 Hospital:
                {" "}
                {cotizacion.hospital}
              </p>

             <p
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>
                📞 Teléfono:
                {" "}
                {cotizacion.telefono}
              </p>

              <p
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>
                💰 Total:
                {" "}
                $
                {cotizacion.totalFinalCliente?.toLocaleString()}
              </p>

              <div
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>
                📅 Plazo:
                <div>
  🕒 Fecha:
  {" "}
  {cotizacion.fecha
    ? new Date(
        cotizacion.fecha.seconds *
          1000
      ).toLocaleString()
    : "Sin fecha"}
</div>
                {" "}
                {cotizacion.meses} meses
              </div>
              <button
  onClick={() =>
  descargarPDF(
    cotizacion
  )
}
  style={{
    marginTop: "20px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#013970",
    color: "white",
    cursor: "pointer",
    width: "100%",
  }}
>
  Descargar PDF 📄
</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}