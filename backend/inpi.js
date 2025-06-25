const axios = require("axios");

function inpiAuthURL() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.INPI_CLIENT_ID,
    redirect_uri: process.env.INPI_CALLBACK_URL,
    scope: "openid"
  });
  return `https://sandbox-api.inpi.fr/auth/oauth/authorize?${params.toString()}`;
}

async function handleInpiCallback(code) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.INPI_CALLBACK_URL,
    client_id: process.env.INPI_CLIENT_ID,
    client_secret: process.env.INPI_CLIENT_SECRET
  });

  const { data } = await axios.post(
    "https://sandbox-api.inpi.fr/auth/oauth/token",
    params
  );
  return data;
}

// Exemple pour un document comptes annuels INPI
async function getComptesAnnuel(token, idDocument) {
  const url = `https://sandbox-api.inpi.fr/api-comptes-annuels/v5/document/${idDocument}`;
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

module.exports = { inpiAuthURL, handleInpiCallback, getComptesAnnuel };