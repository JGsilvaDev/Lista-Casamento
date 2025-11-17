export default function GiftCard({ gift, onToggle }) {
  return (
    <div style={styles.card}>
      <img
        src={gift.imagem}
        alt={gift.nome}
        style={styles.image}
      />

      <h3 style={styles.name}>{gift.nome}</h3>

      <p style={styles.price}>
        R$ {gift.valor.toFixed(2)}
      </p>

      <button
        onClick={onToggle}
        style={{
          ...styles.button,
          backgroundColor: gift.comprado ? "#4caf50" : "#0070f3",
        }}
      >
        {gift.comprado ? "Comprado ✔" : "Marcar como comprado"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    textAlign: "center",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  name: {
    fontSize: "18px",
    margin: "10px 0 5px 0",
    fontWeight: "600",
  },
  price: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
};
