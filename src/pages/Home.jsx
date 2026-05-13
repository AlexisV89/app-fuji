import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize:
            window.innerWidth < 768 ? "35px" : "60px",
          textAlign: "center",
        }}
      >
        APP FUJI 🚀
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Sistema financiero para endoscopia
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          border: "none",
          borderRadius: "12px",
          backgroundColor: "#2563eb",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Entrar al sistema
      </button>
    </div>
  )
}