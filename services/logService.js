const client = require('../config/redisClient');

async function guardarLog(data) {
  const key = `log:${Date.now()}`;
  const value = {
    remitente: data.de,
    destinatario: data.para,
    contenido: data.contenido,
    estado: data.estado || 'enviado',
    timestamp: new Date().toISOString()
  };

  await client.hSet(key, value);
  console.log(`[LOG] Guardado: ${key}`);
}

module.exports = { guardarLog };