import React, { useState } from "react";
import axios from "axios";

export default function SearchForm({ onResult }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await axios.get('https://ton-backend-render/search', { params: { query: input } });
    onResult(response.data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="SIREN, SIRET ou Dénomination" />
      <button type="submit" disabled={loading}>{loading ? "Recherche..." : "Rechercher"}</button>
    </form>
  );
}