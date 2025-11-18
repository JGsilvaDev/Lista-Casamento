"use client";

import Image from "next/image";
import React from "react";

// Tipagem do presente
interface Gift {
  nome: string;
  valor: number;
  imagem: string;
  comprado: boolean;
}

// Tipagem das props do componente
interface GiftCardProps {
  gift: Gift;
  onToggle: () => void; // função que não recebe parâmetro e retorna void
}

// Componente
export default function GiftCard({ gift, onToggle }: GiftCardProps) {
  return (
    <div style={styles.card}>
      <Image
        src={gift.imagem}
        alt={gift.nome}
        width={300}   // ajustar conforme necessidade
        height={180}  // ajustar conforme necessidade
        style={styles.image}
      />

      <h3 style={styles.name}>{gift.nome}</h3>
      <p style={styles.price}>R$ {gift.valor.toFixed(2)}</p>

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

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 15,
    textAlign: "center",
    background: "#fff",
  },
  image: {
    borderRadius: 8,
    objectFit: "cover",
  },
  name: {
    fontSize: 18,
    margin: "10px 0 5px 0",
    fontWeight: 600,
  },
  price: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
};
