const { guardarLog } = require('../services/logService');

async function manejarEvento(mensaje) {
  try {
    const evento = JSON.parse(mensaje);
    if (evento.tipo === 'mensaje_enviado') {
      await guardarLog(evento);
    }
  } catch (err) {
    console.error('[✗] Error procesando evento:', err.message);
  }
}

module.exports = { manejarEvento };