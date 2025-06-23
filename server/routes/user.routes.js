import express from 'express';
import { Register } from '../controllers/user.js';
import { Verify } from '../controllers/user.js';
import { check } from '../controllers/user.js';
import { auth } from '../middlewares/authMiddleware.js'
import { getMe } from '../controllers/user.js';
import { logout } from '../controllers/user.js';
const router = express.Router();

// Register the user or customer
router.post('/register', Register);
// login the route   
router.post('/login', Verify);
router.get('/check', auth, check);
router.get('/profile', auth, getMe);
router.post('/logout',logout);


export default router;