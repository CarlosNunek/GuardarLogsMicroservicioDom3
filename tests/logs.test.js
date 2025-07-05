const { manejarEvento } = require('../controllers/logController');

// 👇 Aquí hacemos el mock manualmente y exportamos el nombre `client` como se usa en tu código
const hSetMock = jest.fn();
jest.mock('../config/redisClient', () => {
  return {
    hSet: hSetMock
  };
});

const mockRedis = require('../config/redisClient');

describe('🧪 Test logController con Redis mockeado', () => {
  beforeEach(() => {
    hSetMock.mockClear();
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

    expect(hSetMock).toHaveBeenCalledTimes(1);

    const [[key, value]] = hSetMock.mock.calls[0];
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
    expect(hSetMock).not.toHaveBeenCalled();
  });
});
