import express from 'express';
import { userLogin, createUser, listUsers, getUserById, updateUser } from '../controllers/userController.js';
import authMiddleware from '#src/middleware/authMiddleware';
import { sanitizeRegistration, sanitizeLogin, sanitizeUpdateUser } from '#src/validations/userValidator';

const router = express.Router();

router.post('/login', sanitizeLogin, userLogin);
router.post('/register', sanitizeRegistration, createUser);
router.get('/', listUsers);
// router.get('/profile', authMiddleware, getUserById);
router.route('/profile').get(authMiddleware, getUserById).put(authMiddleware, sanitizeUpdateUser, updateUser);

export default router;
