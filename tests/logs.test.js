let mockHSet;

// 👇 Primero va el mock
jest.mock('../config/redisClient', () => {
  mockHSet = jest.fn();
  return {
    hSet: mockHSet
  };
});

// 👇 Luego de definir el mock, importa el código a testear
const { manejarEvento } = require('../controllers/logController');
const mockRedis = require('../config/redisClient');

describe('🧪 Test logController con Redis mockeado', () => {
  beforeEach(() => {
    mockHSet.mockClear();
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

    expect(mockHSet).toHaveBeenCalledTimes(1);
    const [[key, value]] = mockHSet.mock.calls[0];

    console.log('🧪 KEY REAL:', key);

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
    expect(mockHSet).not.toHaveBeenCalled();
  });
});
