import request from 'supertest';
import { startServer, stopServer } from '../testServer';

let server;

beforeAll(async () => {
  server = await startServer((app) => {
    app.post('/api/users/register', (req, res) => {
      const { email, password, fullname } = req.body;
      if (!email || !password || !fullname) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

afterAll(async () => {
  await stopServer();
});

describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const response = await request(server)
      .post('/api/users/register')
      .send({ email: 'test@example.com', password: 'Password1!', fullname: 'Test User' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(server)
      .post('/api/users/register')
      .send({ password: 'Password1!', fullname: 'Test User' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required');
  });
});
