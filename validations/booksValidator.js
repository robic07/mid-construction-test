import { body } from 'express-validator';
import { validate } from '#src/utils/expressValidator';

export const validateCreateBook = [
  body('title').notEmpty().withMessage('Title is required'),

  body('description').optional().isString().withMessage('Description must be a string')
];

export const sanitizeCreateBook = [...validateCreateBook, validate]