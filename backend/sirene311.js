const axios = require('axios');

const SIRENE_API_URL = "https://api.sirene.fr/sirene/V3.11";
const SIRENE_API_KEY = process.env.SIRENE_API_KEY; // Ta clé dans .env

/**
 * Recherche multi-critères dans SIRENE 3.11
 * @param {string} query - SIREN, SIRET ou dénomination sociale
 */
async function searchSirene311(query) {
  let endpoint, params = {};
  // Heuristique simple pour type de recherche
  if (/^\d{14}$/.test(query)) {
    endpoint = `/etablissement/${query}`;
  } else if (/^\d{9}$/.test(query)) {
    endpoint = `/unitelegale/${query}`;
  } else {
    endpoint = `/siret`; // peut aussi faire /unitelegale
    params.q = `denominationUniteLegale:${query}*`; // recherche floue
  }

  const url = `${SIRENE_API_URL}${endpoint}`;
  const headers = { Authorization: SIRENE_API_KEY };

  const { data } = await axios.get(url, { headers, params });
  return data;
}

module.exports = { searchSirene311 };