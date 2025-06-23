import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import {
    getDashboardStats,
    getDashboardRooms,
    getDashboardBookings,
    getDashboardMessages
} from '../controllers/dashboard.js';

const router = express.Router();

// Dashboard stats route
router.get('/stats', auth, getDashboardStats);

// Dashboard rooms route
router.get('/rooms', auth, getDashboardRooms);

// Dashboard bookings route
router.get('/bookings', auth, getDashboardBookings);

// Dashboard messages route
router.get('/messages', auth, getDashboardMessages);

export default router; 