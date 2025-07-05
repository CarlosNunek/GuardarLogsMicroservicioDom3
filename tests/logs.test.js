jest.mock('../config/redisClient', () => ({
  hSet: jest.fn(() => Promise.resolve()) // hace que hSet no haga nada y no falle
}));

const redisClient = require('../config/redisClient');
const { manejarEvento } = require('../controllers/logController');

describe('🧪 Test básico del logController (modo fácil)', () => {
  beforeEach(() => {
    redisClient.hSet.mockClear();
  });

  it('✅ manejarEvento ejecuta sin errores con evento válido', async () => {
    const evento = {
      tipo: 'mensaje_enviado',
      de: 'yo',
      para: 'tú',
      contenido: 'hola',
    };

    await expect(manejarEvento(JSON.stringify(evento))).resolves.not.toThrow();
  });

  it('✅ manejarEvento ignora eventos inválidos sin lanzar error', async () => {
    const evento = {
      tipo: 'evento_inútil',
      contenido: 'lo que sea'
    };

    await expect(manejarEvento(JSON.stringify(evento))).resolves.not.toThrow();
  });
});
