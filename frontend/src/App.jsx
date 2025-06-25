import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App() {
  const [search, setSearch] = useState(""); // SIRENE/SIRET/SIREN/raison sociale
  const [tva, setTva] = useState("");
  const [idDocument, setIdDocument] = useState(""); // Pour test INPI comptes annuels

  const [sirene, setSirene] = useState(null);
  const [vies, setVies] = useState(null);
  const [inpiToken, setInpiToken] = useState(null);
  const [comptesInpi, setComptesInpi] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleCombinedSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSirene(null);
    setVies(null);
    setComptesInpi(null);

    // Appels combinés SIRENE et VIES
    try {
      const [sireneRes, viesRes] = await Promise.all([
        fetch(`${API_URL}/api/sirene?query=${encodeURIComponent(search)}`).then(r => r.json()),
        tva ? fetch(`${API_URL}/api/vies?tva=${encodeURIComponent(tva)}`).then(r => r.json()) : Promise.resolve(null)
      ]);
      setSirene(sireneRes);
      setVies(viesRes);
    } catch (e) {
      setSirene({ error: e.message });
      setVies({ error: e.message });
    }
    setLoading(false);
  };

  // INPI Auth (ouvre une popup)
  const handleInpiLogin = () => {
    window.open(`${API_URL}/api/inpi/login`, "_blank", "width=500,height=700");
  };

  // Récupération de comptes annuels
  const handleComptes = async (e) => {
    e.preventDefault();
    if (!inpiToken || !idDocument) return;
    setComptesInpi("Chargement...");
    try {
      const res = await fetch(`${API_URL}/api/inpi/comptes?token=${encodeURIComponent(inpiToken)}&id=${encodeURIComponent(idDocument)}`);
      const data = await res.json();
      setComptesInpi(data);
    } catch (e) {
      setComptesInpi({ error: e.message });
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Widget Entreprises</h1>

      <form onSubmit={handleCombinedSearch} style={{ marginBottom: 30 }}>
        <h2>Recherche combinée SIRENE & TVA</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nom, SIREN ou SIRET"
          style={{ marginRight: 10 }}
        />
        <input
          value={tva}
          onChange={e => setTva(e.target.value)}
          placeholder="TVA intracommunautaire (ex : FR12345678901)"
          style={{ marginRight: 10 }}
        />
        <button type="submit" disabled={loading}>Rechercher</button>
      </form>

      {sirene && (
        <section>
          <h3>Résultat SIRENE :</h3>
          <pre style={{ background: "#222", color: "#fff", padding: 10, overflowX: "auto" }}>
            {JSON.stringify(sirene, null, 2)}
          </pre>
        </section>
      )}
      {vies && (
        <section>
          <h3>Résultat TVA (VIES) :</h3>
          <pre style={{ background: "#222", color: "#fff", padding: 10, overflowX: "auto" }}>
            {JSON.stringify(vies, null, 2)}
          </pre>
        </section>
      )}

      <section>
        <h2>Connexion INPI (OAuth2)</h2>
        <button onClick={handleInpiLogin}>Connexion via INPI</button>
        <p>
          Après connexion, entrez votre <b>access_token INPI</b> ci-dessous
          (copiez-le depuis la popup, ou améliorez ce flow pour l’automatiser).
        </p>
        <input
          value={inpiToken || ""}
          onChange={e => setInpiToken(e.target.value)}
          placeholder="Access token INPI"
          style={{ width: "100%", margin: "5px 0" }}
        />
        <form onSubmit={handleComptes}>
          <input
            value={idDocument}
            onChange={e => setIdDocument(e.target.value)}
            placeholder="ID document comptes annuels INPI"
            style={{ marginRight: 10 }}
          />
          <button type="submit" disabled={!inpiToken || !idDocument}>Récupérer document</button>
        </form>
        {comptesInpi && (
          <pre style={{ background: "#222", color: "#fff", padding: 10, overflowX: "auto" }}>
            {JSON.stringify(comptesInpi, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}