const request = require('supertest');
const { createClient } = require('redis');
const app = require('../app'); // asegúrate que app.js exporta tu instancia de Express

let redis;

describe('Test del microservicio de logs (Redis oficial)', () => {

  beforeAll(async () => {
    redis = createClient({
      url: 'redis://localhost:6379' // puedes cambiarlo por process.env.REDIS_URL si usas .env
    });

    redis.on('error', (err) => console.error('Redis Client Error', err));

    await redis.connect();
    await redis.flushAll(); // limpia la base Redis antes de las pruebas
  });

  afterAll(async () => {
    await redis.quit(); // cierra conexión con Redis
  });

  it('POST /api/logs debería guardar el evento en Redis', async () => {
    const fakeLog = {
      servicio: "moderador_mensajes",
      tipo: "INFO",
      mensaje: "Mensaje moderado con éxito",
      fecha: new Date().toISOString()
    };

    const res = await request(app)
      .post('/api/logs')
      .send(fakeLog);

    expect(res.statusCode).toBe(201);

    // Validar que Redis tiene el log
    const logs = await redis.lRange('logs', 0, -1); // obtiene todos los logs de la lista
    expect(logs.length).toBeGreaterThan(0);

    const parsedLog = JSON.parse(logs[0]);
    expect(parsedLog.servicio).toBe('moderador_mensajes');
    expect(parsedLog.tipo).toBe('INFO');
  });

});
