// books.test.js
import request from 'supertest';
import { startServer, stopServer } from '../testServer'; // Adjust the import to your actual path
import { sanitizeCreateBook } from '#src/validations/booksValidator'; // Adjust the import to your actual path

let server;

beforeAll(async () => {
  // Start the server and apply routes dynamically
  server = await startServer((app) => {
    app.post('/api/books', sanitizeCreateBook, (req, res) => {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      return res.status(201).json({ message: 'Book created successfully' });
    });
  });
});

afterAll(async () => {
  await stopServer(); // Stop the server after tests
});

describe('POST /api/books', () => {
  it('should create a new book', async () => {
    const response = await request(server)
      .post('/api/books')
      .send({ title: 'Test Book Title', description: 'Test Book Description' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Book created successfully');
  });

  it('should not create a book when title is missing', async () => {
    const response = await request(server).post('/api/books').send({ description: 'Test Book Description' });
    expect(response.status).toBe(422); // Expect 422 since validation fails
    expect(response.body.errors[0].msg).toBe('Title is required'); // Check error message
  });

  it('should not create a book when description is not a string', async () => {
    const response = await request(server).post('/api/books').send({ title: 'Test Book Title', description: 123 });
    expect(response.status).toBe(422);
    expect(response.body.errors[0].msg).toBe('Description must be a string');
  });
});
