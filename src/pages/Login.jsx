import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const iniciarSesion = async () => {
    try {
      await signInWithEmailAndPassword(
  auth,
  `${usuario}@endosalud.com.mx`,
  password
)

      navigate("/dashboard")
    } catch (err) {
      setError("Correo o contraseña incorrectos")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#013970",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#013970",
          }}
        >
          Login 🔐
        </h1>

        <input
          type="text"
placeholder="Usuario"
value={usuario}
onChange={(e) => setUsuario(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          onClick={iniciarSesion}
          style={buttonStyle}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #0073ff",
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
  fontSize: "18px",
  cursor: "pointer",
}