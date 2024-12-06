import express from 'express';
import http from 'http';

let server;

export const startServer = async (setupRoutes = (app) => {}) => {
  const app = express();

  // Add default middleware
  app.use(express.json());

  // Allow custom routes or middleware to be set up by passing a callback
  setupRoutes(app);

  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      console.log(`Test server running on port ${server.address().port}`);
      resolve(server);
    });
  });
};

export const stopServer = async () => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
};
