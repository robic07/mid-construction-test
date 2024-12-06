import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes List
import userRoutes from './routes/userRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api/users", userRoutes);

app.use(
  cors({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
  })
);

app.use('/api/users', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/favorites', favoritesRoutes);

/* Middleware */
app.use(notFound);
app.use(errorHandler);

// app.listen(port, () => {
//   connectDB();
//   console.log(`Server running on port ${port}`);
// });

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
  });
}
