import express from 'express';
import { AdminLogin } from '../controllers/admin.js';
import { Admin } from '../controllers/admin.js';
import { checkAuthStatus } from '../controllers/admin.js';
import { auth } from '../middlewares/authMiddleware.js';
const router = express.Router();


// the admin login route

router.post('/admin/login', AdminLogin);

// the route admin to redirect to dashboard
router.get('/admin', auth, Admin)
router.get('/auth/check', auth, checkAuthStatus)
export default router;