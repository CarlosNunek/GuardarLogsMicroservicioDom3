const request = require('supertest');
const Redis = require('ioredis');
const app = require('../app'); // exporta tu instancia de Express

// Config Redis
const redis = new Redis({ host: 'localhost', port: 6379 }); // o usar .env

describe('🧪 Test del microservicio de logs (Redis)', () => {

  beforeAll(async () => {
    await redis.flushall(); // limpia Redis antes de pruebas
  });

  afterAll(async () => {
    await redis.quit(); // cierra conexión
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
    const logs = await redis.lrange('logs', 0, -1);
    expect(logs.length).toBeGreaterThan(0);

    const parsedLog = JSON.parse(logs[0]);
    expect(parsedLog.servicio).toBe('moderador_mensajes');
    expect(parsedLog.tipo).toBe('INFO');
  });

});
