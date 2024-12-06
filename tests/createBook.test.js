import request from 'supertest';
import { startServer, stopServer } from '../testServer';

let server;

beforeAll(async () => {
  server = await startServer((app) => {
    app.post('/api/books', (req, res) => {
      const { title, description } = req.body;
      if (!title) return res.status(400).json({ message: 'Title is required' });
      return res.status(201).json({ message: 'Book created successfully' });
    });
  });
});

afterAll(async () => {
  await stopServer();
});

describe('POST /api/books', () => {
  it('should create a new book', async () => {
    const response = await request(server)
      .post('/api/books')
      .send({ title: 'Test Book Title', description: 'Test Book Description' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Book created successfully');
  });
});
