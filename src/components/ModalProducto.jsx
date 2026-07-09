const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
}

export default function ModalProducto({
  mostrarModal,
  setMostrarModal,
  guardarProducto,
  especialidad,
  setEspecialidad,
  codigo,
  setCodigo,
  producto,
  setProducto,
  entrega,
  setEntrega,
  precioConvenio,
  setPrecioConvenio,
  poliza,
  setPoliza,
  preventivos,
  setPreventivos,
  productoEditar,
}) {

  if (!mostrarModal) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "700px",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 50px rgba(0,0,0,.3)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#013970",
          }}
        >
          {productoEditar
? "✏️ Editar Producto"
: "➕ Agregar Producto"}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <input
            placeholder="Especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            style={{
              ...inputStyle,
              gridColumn: "1 / 3",
            }}
          />

          <input
            placeholder="Tiempo de entrega"
            value={entrega}
            onChange={(e) => setEntrega(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Precio convenio"
            value={precioConvenio}
            onChange={(e) => setPrecioConvenio(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Póliza"
            value={poliza}
            onChange={(e) => setPoliza(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Preventivos"
            value={preventivos}
            onChange={(e) => setPreventivos(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={() => setMostrarModal(false)}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={guardarProducto}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 Guardar Producto
          </button>
        </div>
      </div>
    </div>
  )
}