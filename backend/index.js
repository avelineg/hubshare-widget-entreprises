const express = require('express');
const cors = require('cors');
const { searchSirene311 } = require('./sirene311');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const result = await searchSirene311(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});