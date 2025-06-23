// controllers/booking.js
import Booking from "../models/Booking.js";
import { sendBookingConfirmation } from "../services/nodeMailer.js";

// ==============================
// ADD BOOKING
// ==============================
export const addBooking = async(req, res) => {
    try {
        const {
            roomId,
            checkIn,
            checkOut,
            guests,
            name,
            email,
            phone,
            paymentMethod,
            totalAmount,
        } = req.body;

        if (!roomId ||
            !checkIn ||
            !checkOut ||
            !guests ||
            !name ||
            !email ||
            !phone ||
            !paymentMethod ||
            totalAmount === undefined
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        const userId = req.user.id || null;
        const bookingData = {
            ...req.body,
            userId,
            totalAmount: Number(totalAmount),
        };

        const booking = new Booking(bookingData);
        await booking.save();

        res.json({
            success: true,
            message: "Booking created successfully",
            bookingId: booking._id,
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// ==============================
// CONFIRM BOOKING + SEND EMAIL
// ==============================
export const sentMail = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        booking.status = "Confirmed";
        await booking.save();

        // Send email with link to download ticket
        await sendBookingConfirmation(booking.email, booking.name, {
            room: booking.roomId,
            checkin: booking.checkIn,
            checkout: booking.checkOut,
            guests: booking.guests,
        });

        res.status(200).json({
            success: true,
            message: "Booking confirmed and email sent",
        });
    } catch (error) {
        console.error("Send mail error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Get all bookings
export const getBooking = async(req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error getting bookings:", error);
        res.status(500).json({ message: "Failed to get bookings" });
    }
};

// Get booking status
export const getBookingStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Booking not found" 
            });
        }

        // Check if user owns this booking
        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to view this booking" 
            });
        }

        res.json({
            success: true,
            status: booking.status,
            booking: booking
        });
    } catch (error) {
        console.error("Error getting booking status:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to get booking status" 
        });
    }
};

// Get user's bookings
export const getUserBookings = async(req, res) => {
    try {
        const userId = req.user.id;
        
        const bookings = await Booking.find({ userId })
            .populate('roomId', 'type roomNumber price image')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings: bookings
        });
    } catch (error) {
        console.error("Error getting user bookings:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to get user bookings" 
        });
    }
};