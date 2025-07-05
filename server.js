require('dotenv').config();
const redis = require('redis');
const { manejarEvento } = require('./controllers/logController');

(async () => {
  const subscriber = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  });

  await subscriber.connect();

  console.log(`[📡] logservice escuchando en canal: ${process.env.CHANNEL}`);

  await subscriber.subscribe(process.env.CHANNEL, (mensaje) => {
    manejarEvento(mensaje);
  });
})();
module.exports = app;