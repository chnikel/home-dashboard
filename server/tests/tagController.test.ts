import request from 'supertest';
import app from '../src/app';

describe('Tag Controller', () => {
  it('GET /tags should return a list of tags', async () => {
    const response = await request(app).get('/tags');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(typeof response.body[0].id).toBe("number")
    expect(typeof response.body[0].name).toBe("string")
    expect(typeof response.body[0].color).toBe("string")
    expect(typeof response.body[0].weight).toBe("number")
  });
});