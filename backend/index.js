require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { searchSirene } = require("./sirene");

const app = express();
app.use(cors());
app.use(express.json());

// Route SIRENE
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

// Route racine optionnelle
app.get("/", (req, res) => {
  res.send("Bienvenue sur l’API Widget Entreprises !");
});

// Route ping pour test Render
app.get("/api/ping", (req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
