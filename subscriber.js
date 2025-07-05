
require('dotenv').config();
const redis = require('redis');
const fs = require('fs');

const subscriber = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.connect();

subscriber.subscribe('chat-eventos', (mensajeStr) => {
  const mensaje = JSON.parse(mensajeStr);

  // Opción: guardar en archivo local
  const log = `[${new Date().toISOString()}] DE: ${mensaje.de} PARA: ${mensaje.para} -> ${mensaje.contenido}\n`;
  fs.appendFile('logs.txt', log, err => {
    if (err) console.error('❌ Error al guardar log:', err);
  });

  // Opción: guardar también en Redis
  subscriber.rPush('logs_chat', JSON.stringify(mensaje));
});
