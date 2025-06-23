import express from "express";
import { addBooking, sentMail, getBooking, getBookingStatus, getUserBookings } from "../controllers/booking.js";
import { auth } from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post("/booking", auth, addBooking);
router.put("/confirm/:id", sentMail);
router.get('/get/booking', getBooking);
router.get('/booking/:id/status', auth, getBookingStatus);
router.get('/user/bookings', auth, getUserBookings);
export default router;