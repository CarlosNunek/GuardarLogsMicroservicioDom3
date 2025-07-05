const { manejarEvento } = require('../controllers/logController');

jest.mock('../config/redisClient', () => ({
  hSet: jest.fn(() => Promise.resolve('OK'))
}));

const mockRedis = require('../config/redisClient');

describe('Test logController con Redis mockeado', () => {
  it('Debería llamar a guardarLog con evento válido', async () => {
    const evento = {
      tipo: 'mensaje_enviado',
      de: 'usuario1',
      para: 'usuario2',
      contenido: 'Hola',
      estado: 'entregado'
    };

    await manejarEvento(JSON.stringify(evento));

    expect(mockRedis.hSet).toHaveBeenCalledTimes(1);
    const [[key, value]] = mockRedis.hSet.mock.calls[0];
    expect(key).toMatch(/^log:/);
    expect(value.remitente).toBe('usuario1');
    expect(value.destinatario).toBe('usuario2');
    expect(value.contenido).toBe('Hola');
    expect(value.estado).toBe('entregado');
    expect(value.timestamp).toBeDefined();
  });

  it('No debería guardar si el evento no es tipo "mensaje_enviado"', async () => {
    const evento = {
      tipo: 'otro_tipo',
      de: 'usuario1',
      para: 'usuario2',
      contenido: 'Ignorar'
    };

    await manejarEvento(JSON.stringify(evento));

    expect(mockRedis.hSet).not.toHaveBeenCalled();
  });
});

