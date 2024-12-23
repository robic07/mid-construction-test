import { body } from 'express-validator';
import { validate } from '#src/utils/expressValidator';

export const validateCreateBook = [
  body('title').notEmpty().withMessage('Title is required'),

  body('description').optional().isString().withMessage('Description must be a string')
];

export const validateUpdateBook = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];


export const sanitizeCreateBook = [...validateCreateBook, validate];
export const sanitizeUpdateBook = [...validateUpdateBook, validate];
