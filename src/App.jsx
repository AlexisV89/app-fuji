import {
  useEffect,
  useState,
} from "react"
import AdminRoute from "./components/AdminRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Cotizador from "./pages/Cotizador"
import Cotizaciones from "./pages/Cotizaciones"
import Productos from "./pages/Productos"
import Usuarios from "./pages/Usuarios"
import LPProductos from "./pages/LPProductos"

function App() {

  const [online, setOnline] =
  useState(navigator.onLine)
  const [sincronizando,
  setSincronizando] =
  useState(false)

useEffect(() => {
 const onlineHandler = () => {
  setOnline(true)

  setSincronizando(true)

  setTimeout(() => {
    setSincronizando(false)
  }, 3000)
}

  const offlineHandler = () =>
    setOnline(false)

  window.addEventListener(
    "online",
    onlineHandler
  )

  window.addEventListener(
    "offline",
    offlineHandler
  )

  return () => {
    window.removeEventListener(
      "online",
      onlineHandler
    )

    window.removeEventListener(
      "offline",
      offlineHandler
    )
  }
}, [])
  return (
   <BrowserRouter basename="/">
    {!online && (
  <div
    style={{
      backgroundColor: "#dc2626",
      color: "white",
      padding: "10px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    Sin conexión 📡
  </div>
)}
{sincronizando && (
  <div
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      padding: "10px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    Sincronizando datos ☁️
  </div>
)}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cotizador"
  element={
    <ProtectedRoute>
      <Cotizador />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cotizaciones"
  element={
    <ProtectedRoute>
      <Cotizaciones />
    </ProtectedRoute>
  }
/>
<Route
  path="/productos"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <Productos />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/usuarios"
  element={
    <ProtectedRoute>
      <AdminRoute>
        <Usuarios />
      </AdminRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/lp-productos"
  element={
    <ProtectedRoute>
      <LPProductos />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App