import React from "react";

export default function ResultsList({ results }) {
  if (!results) return null;
  if (!results.length) return <div>Aucun résultat</div>;
  return (
    <ul>
      {results.map(societe => (
        <li key={societe.siret}>
          <strong>{societe.denomination}</strong> — SIREN: {societe.siren} — SIRET: {societe.siret}
          {/* Détails complémentaires ici */}
        </li>
      ))}
    </ul>
  );
}