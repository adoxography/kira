import request from 'supertest';
import app from '../src/app';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      toHaveErrorMessage(message: string): CustomMatcherResult
    }
  }
}

interface HasMessage {
  message: string
}

expect.extend({
  toHaveErrorMessage(received, message) {
    const { details } = JSON.parse(received.text);
    let messages: Array<string> = [];

    if (details.body) {
      messages = [...messages, ...details.body.map((error: HasMessage) => error.message)];
    }

    if (details.query) {
      messages = [...messages, ...details.query.map((error: HasMessage) => error.message)];
    }

    const pass = messages.includes(message);

    if (pass) {
      return {
        message: () => `"${messages}" should not contain "${message}"`,
        pass
      };
    }

    return {
      message: () => `"${messages}" should contain "${message}"`,
      pass
    };
  }
});

describe('/status', () => {
  test('it responds with 200 if params are valid', async () => {
    const params = {
      width: 3,
      height: 3,
      k: 3,
      timePerMove: 2
    };

    const response = await request(app)
      .get('/status')
      .query(params);

    expect(response.statusCode).toBe(200);
  });

  describe('validation', () => {
    test('the width is required', async () => {
      const response = await request(app)
        .get('/status')
        .query({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" is required');
    });

    test('the width must be a number', async () => {
      const params = {
        width: 'WRONG'
      };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" must be a number');
    });

    test('the width must be an integer', async () => {
      const params = {
        width: 3.3
      };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" must be an integer');
    });

    test('the height is required', async () => {
      const response = await request(app)
        .get('/status')
        .query({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" is required');
    });

    test('the height must be a number', async () => {
      const params = { height: 'WRONG' };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" must be a number');
    });

    test('the height must be an integer', async () => {
      const params = { height: 3.3 };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" must be an integer');
    });

    test('k is required', async () => {
      const response = await request(app)
        .get('/status')
        .query({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" is required');
    });

    test('k must be a number', async () => {
      const params = { k: 'WRONG' };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" must be a number');
    });

    test('k must be an integer', async () => {
      const params = { k: 3.3 };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" must be an integer');
    });

    test('timePerMove is required', async () => {
      const response = await request(app)
        .get('/status')
        .query({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" is required');
    });

    test('timePerMove must be a number', async () => {
      const params = { timePerMove: 'WRONG' };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" must be a number');
    });

    test('timePerMove must be at least 1', async () => {
      const params = { timePerMove: 0 };

      const response = await request(app)
        .get('/status')
        .query(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" must be greater than or equal to 1');
    });
  });
});

describe('/move', () => {
  test('it returns a 200 if the params are valid', async () => {
    const params = {
      width: 3,
      height: 3,
      cells: [0, 1, 1, 1, 0, 0, 0, 0, null],
      k: 3,
      timePerMove: 3,
      turn: 0
    };

    const response = await request(app)
      .post('/move')
      .send(params);

    expect(response.statusCode).toBe(200);
  });

  test('it finds the best move', async () => {
    const params = {
      width: 3,
      height: 3,
      cells: [0, null, 1, 1, 0, null, 0, null, null],
      k: 3,
      timePerMove: 3,
      turn: 0
    };

    const response = await request(app)
      .post('/move')
      .send(params);

    expect(response.text).toBe('8');
  });

  describe('validation', () => {
    test('the width is required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" is required');
    });

    test('the width must be a number', async () => {
      const params = {
        width: 'WRONG'
      };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" must be a number');
    });

    test('the width must be an integer', async () => {
      const params = {
        width: 3.3
      };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"width" must be an integer');
    });

    test('the height is required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" is required');
    });

    test('the height must be a number', async () => {
      const params = { height: 'WRONG' };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" must be a number');
    });

    test('the height must be an integer', async () => {
      const params = { height: 3.3 };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"height" must be an integer');
    });

    test('the cells are required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"cells" is required');
    });

    test('the cells must be an array', async () => {
      const params = { cells: 'WRONG' };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"cells" must be an array');
    });

    test('the cells must be width * height', async () => {
      const params = {
        width: 3,
        height: 4,
        cells: [0, null, 1, 1, 0, null, 0, null, null]
      };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"cells" must contain {{width * height}} items');
    });

    test('the cell values must be valid', async () => {
      const params = {
        cells: [0, null, 1, 1, 0, 2, 0, null, null]
      };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"cells[5]" does not match any of the allowed types');
    });

    test('k is required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" is required');
    });

    test('k must be a number', async () => {
      const params = { k: 'WRONG' };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" must be a number');
    });

    test('k must be an integer', async () => {
      const params = { k: 3.3 };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"k" must be an integer');
    });

    test('timePerMove is required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" is required');
    });

    test('timePerMove must be a number', async () => {
      const params = { timePerMove: 'WRONG' };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" must be a number');
    });

    test('timePerMove must be at least 1', async () => {
      const params = { timePerMove: 0 };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"timePerMove" must be greater than or equal to 1');
    });

    test('turn is required', async () => {
      const response = await request(app)
        .post('/move')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"turn" is required');
    });

    test('turn must be a valid turn', async () => {
      const params = { turn: 'WRONG' };

      const response = await request(app)
        .post('/move')
        .send(params);

      expect(response.statusCode).toBe(400);
      expect(response).toHaveErrorMessage('"turn" must be one of [0, 1]');
    });
  });
});
