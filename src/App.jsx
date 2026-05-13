import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Cotizador from "./pages/Cotizador"
import Cotizaciones from "./pages/Cotizaciones"
import Productos from "./pages/Productos"
import Usuarios from "./pages/Usuarios"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cotizador" element={<Cotizador />} />
        <Route
  path="/cotizaciones"
  element={<Cotizaciones />}
/>
<Route
  path="/productos"
  
  element={<Productos />}
/>
<Route
  path="/usuarios"
  element={<Usuarios />}
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App