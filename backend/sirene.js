const axios = require(axios);

const SIRENE_API_URL = "https://api.sirene.fr/sirene/V3.11";

async function searchSirene(query, apiKey) {
  let endpoint, params = {};
  if (^d{14}$.test(query)) {
    endpoint = `etablissement${query}`;
  } else if (^d{9}$.test(query)) {
    endpoint = `unitelegale${query}`;
  } else {
    endpoint = `siret`;
    params.q = `denominationUniteLegale${query}`;
    params.nombre = 10;
  }
  const url = `${SIRENE_API_URL}${endpoint}`;
  const headers = { Authorization apiKey };
  const { data } = await axios.get(url, { headers, params });
  return data;
}

module.exports = { searchSirene };
