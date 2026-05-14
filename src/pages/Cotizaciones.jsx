import jsPDF from "jspdf"

import html2canvas from "html2canvas"
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
const descargarPDF = async (
  id
) => {
  const input =
    document.getElementById(id)

  const canvas =
    await html2canvas(input)

  const imgData =
    canvas.toDataURL("image/png")

  const pdf = new jsPDF()

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    210,
    140
  )

  pdf.save("cotizacion.pdf")
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

              <p
  style={{
    color: "#0f172a",
    marginTop: "10px",
    fontSize: "16px",
  }}
>
                📅 Plazo:
                <p>
  🕒 Fecha:
  {" "}
  {cotizacion.fecha
    ? new Date(
        cotizacion.fecha.seconds *
          1000
      ).toLocaleString()
    : "Sin fecha"}
</p>
                {" "}
                {cotizacion.meses} meses
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}