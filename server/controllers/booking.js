// controllers/booking.js
import Booking from "../models/Booking.js";
import { sendBookingConfirmation } from "../services/nodeMailer.js";
import querystring from 'querystring';
import crypto from 'crypto';
// ==============================
// ADD BOOKING
// ==============================
/*export const addBooking = async(req, res) => {
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
}; */



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

        if (!roomId || !checkIn || !checkOut || !guests || !name || !email || !phone || !paymentMethod || totalAmount === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userId = req.user.id || null;

        const bookingData = {
            ...req.body,
            userId,
            totalAmount: Number(totalAmount),
            status: paymentMethod === 'cash_on_arrival' ? 'confirmed' : 'pending'
        };

        const booking = new Booking(bookingData);
        await booking.save();

        if (paymentMethod === 'payfast') {
            const paymentUrl = initiatePayFastPayment(booking);

            return res.json({
                success: true,
                message: "PayFast payment initiated",
                bookingId: booking._id,
                paymentUrl: paymentUrl
            });
        }

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

const initiatePayFastPayment = (booking) => {
    const payfastData = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        return_url: `${process.env.FRONTEND_URL}/booking/success?bookingId=${booking._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/booking/canceled?bookingId=${booking._id}`,
        notify_url: `${process.env.BACKEND_URL}/api/payfast/notify`,
        name_first: booking.name,
        email_address: booking.email,
        m_payment_id: `BOOKING-${booking._id}`,
        amount: booking.totalAmount.toFixed(2),
        item_name: `Room Booking - ${booking.roomId}`
    };

    // Create signature
    const sortedData = Object.entries(payfastData).sort((a, b) => a[0].localeCompare(b[0]));
    let queryString = sortedData.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

    if (process.env.PAYFAST_PASSPHRASE) {
        queryString += `&passphrase=${encodeURIComponent(process.env.PAYFAST_PASSPHRASE)}`;
    }

    const signature = crypto.createHash('md5').update(queryString).digest('hex');
    const finalUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}&signature=${signature}`;
    console.log(signature)
    return finalUrl;
};

export const verifyPayment = async(req, res) => {
    try {
        console.log("Received PayFast IPN:", req.body);

        const { m_payment_id, payment_status } = req.body;

        if (!m_payment_id || !payment_status) {
            return res.status(400).send("Missing payment ID or status");
        }

        const bookingId = m_payment_id.split('-')[1];
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        if (payment_status === 'COMPLETE') {
            booking.status = 'confirmed';
            booking.paymentDetails = req.body;
            await booking.save();

            return res.status(200).send('OK');
        } else {
            booking.status = 'cancelled';
            await booking.save();
            return res.status(200).send('Payment not completed');
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).send('Server error');
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

        booking.status = "confirmed";
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

// Get all confirmed bookings
export const getConfirmedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'confirmed' });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch confirmed bookings" });
  }
};