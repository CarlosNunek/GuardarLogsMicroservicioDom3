// ✅ mock directo en el require (sin variables fuera de scope, sin confusiones)
jest.mock('../config/redisClient', () => ({
  hSet: jest.fn()
}));

// ✅ importar después del mock
const { manejarEvento } = require('../controllers/logController');
const redisClient = require('../config/redisClient'); // este es el mock real

describe('🧪 Test logController con Redis mockeado', () => {
  beforeEach(() => {
    redisClient.hSet.mockClear();
  });

  it('✅ Debería llamar a guardarLog con evento válido', async () => {
    const evento = {
      tipo: 'mensaje_enviado',
      de: 'usuario1',
      para: 'usuario2',
      contenido: 'Hola',
      estado: 'entregado'
    };

    await manejarEvento(JSON.stringify(evento));

    expect(redisClient.hSet).toHaveBeenCalledTimes(1);

    const [[key, value]] = redisClient.hSet.mock.calls[0];
    console.log('🧪 KEY REAL:', key);

    // ✅ finalmente validamos
    expect(typeof key).toBe('string');
    expect(key.startsWith('log:')).toBe(true);

    expect(value.remitente).toBe('usuario1');
    expect(value.destinatario).toBe('usuario2');
    expect(value.contenido).toBe('Hola');
    expect(value.estado).toBe('entregado');
    expect(value.timestamp).toBeDefined();
  });

  it('❌ No debería guardar si el evento no es tipo "mensaje_enviado"', async () => {
    const evento = {
      tipo: 'otro_tipo',
      de: 'usuario1',
      para: 'usuario2',
      contenido: 'Ignorar'
    };

    await manejarEvento(JSON.stringify(evento));
    expect(redisClient.hSet).not.toHaveBeenCalled();
  });
});
