"use client";

import { useEffect } from "react";
import apiClient from "../../api/api-client";

export default function ProductsPage() {
  useEffect(() => {
    apiClient
      .get("/products")
      .then((res) => console.log("Connessione OK! Dati:", res.data))
      .catch((err) => console.error("Connessione fallita:", err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
    </div>
  );
}
