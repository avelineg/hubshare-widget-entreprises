const axios = require("axios");

async function checkTva(tva) {
  // Wrapper REST public pour la démo
  const { data } = await axios.get(`https://api.vatcomply.com/vat?vat_number=${tva}`);
  return data;
}

module.exports = { checkTva };