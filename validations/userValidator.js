import { body, param, query } from 'express-validator';
import { validate } from '#src/utils/expressValidator';
export const validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('fullname').not().isEmpty().withMessage('Full name is required'),

  body('username').isLength({ max: 25 }).withMessage('Username can be at most 25 characters long')
];

export const validateLogin = [
  body('username').not().isEmpty().withMessage('Username is required'),
  body('password').not().isEmpty().withMessage('Password is required')
];

export const validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('fullname').optional().not().isEmpty().withMessage('Full name is required'),

  body('username').optional().isLength({ max: 25 }).withMessage('Username can be at most 25 characters long')
];

export const sanitizeRegistration = [...validateRegistration, validate];
export const sanitizeLogin = [...validateLogin, validate];
export const sanitizeUpdateUser= [...validateUpdateUser, validate];
