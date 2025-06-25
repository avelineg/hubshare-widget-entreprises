require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const SIRENE_API_URL = "https://api.sirene.fr/sirene/V3.11";
const SIRENE_API_KEY = process.env.SIRENE_API_KEY;

// Route de test
app.get('/', (req, res) => {
  res.send('Backend opérationnel !');
});

// Route de recherche
app.get('/search', async (req, res) => {
  const { query } = req.query;
  let endpoint, params = {};
  if (/^\d{14}$/.test(query)) {
    endpoint = `/etablissement/${query}`;
  } else if (/^\d{9}$/.test(query)) {
    endpoint = `/unitelegale/${query}`;
  } else {
    endpoint = `/siret`;
    params.q = `denominationUniteLegale:${query}*`;
    params.nombre = 10;
  }
  try {
    const url = `${SIRENE_API_URL}${endpoint}`;
    const headers = { Authorization: SIRENE_API_KEY };
    const { data } = await axios.get(url, { headers, params });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
