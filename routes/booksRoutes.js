import express from 'express';
import {
  createBook,
  getAllBooks,
  getOneBook,
  updateBook,
  softDeleteBook,
  restoreBook,
  deleteBook
} from '#src/controllers/booksController';
import authMiddleware from '#src/middleware/authMiddleware';
import { sanitizeCreateBook, sanitizeUpdateBook } from '#src/validations/booksValidator';

const router = express.Router();
router.route('/').get(getAllBooks).post(authMiddleware, sanitizeCreateBook, createBook);
router.route('/:id').get(getOneBook).put(authMiddleware, sanitizeUpdateBook, updateBook);
router.route('/:id/archive').delete(authMiddleware, softDeleteBook);
router.route('/:id/restore').patch(authMiddleware, restoreBook);
router.route('/:id/delete').delete(authMiddleware, deleteBook);

export default router;
