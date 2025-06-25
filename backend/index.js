require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { searchSirene } = require("./sirene");
const { checkTva } = require("./vies");
const { inpiAuthURL, handleInpiCallback, getComptesAnnuel } = require("./inpi");

const app = express();
app.use(cors());
app.use(express.json());

// SIRENE V3.11 (clé API)
app.get("/api/sirene", async (req, res) => {
  try {
    const data = await searchSirene(
      req.query.query,
      process.env.SIRENE_API_KEY
    );
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// VIES (TVA)
app.get("/api/vies", async (req, res) => {
  try {
    const data = await checkTva(req.query.tva);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// INPI OAuth2
app.get("/api/inpi/login", (req, res) => {
  res.redirect(inpiAuthURL());
});

app.get("/api/inpi/callback", async (req, res) => {
  try {
    const tokenData = await handleInpiCallback(req.query.code);
    res.json(tokenData);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

// Récupération d'un document INPI (comptes annuels)
app.get("/api/inpi/comptes", async (req, res) => {
  try {
    const { token, id } = req.query;
    const data = await getComptesAnnuel(token, id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e?.response?.data || e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));