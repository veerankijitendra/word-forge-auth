import request from 'supertest';
import app from '../app';

describe('App Level Setup', () => {
  it('should return 200 and a status of success from the health check endpoint', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      message: 'API is running healthy',
    });
  });

  it('should handle undefined routes with 404 naturally from Express', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
