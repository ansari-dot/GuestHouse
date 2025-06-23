import Room from '../models/Rooms.js';
import Booking from '../models/Booking.js';
import Message from '../models/FeedBack.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get real data from database
        const totalRooms = await Room.countDocuments();
        const availableRooms = await Room.countDocuments({ available: true });
        const occupiedRooms = totalRooms - availableRooms;

        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

        // Calculate total revenue from confirmed bookings
        const confirmedBookingsData = await Booking.find({ status: 'Confirmed' });
        const totalRevenue = confirmedBookingsData.reduce((sum, booking) => sum + booking.totalAmount, 0);

        const totalMessages = await Message.countDocuments();
        const unreadMessages = await Message.countDocuments({ read: false });

        res.json({
            rooms: {
                total: totalRooms,
                available: availableRooms,
                occupied: occupiedRooms
            },
            bookings: {
                total: totalBookings,
                confirmed: confirmedBookings,
                pending: pendingBookings,
                cancelled: cancelledBookings,
                revenue: totalRevenue
            },
            messages: {
                total: totalMessages,
                unread: unreadMessages
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
};

// Get dashboard rooms
export const getDashboardRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 }).limit(10);
        res.json(rooms);
    } catch (error) {
        console.error('Dashboard rooms error:', error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
};

// Get dashboard bookings
export const getDashboardBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'username email')
            .populate('roomId', 'type roomNumber')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(bookings);
    } catch (error) {
        console.error('Dashboard bookings error:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

// Get dashboard messages
export const getDashboardMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
        res.json(messages);
    } catch (error) {
        console.error('Dashboard messages error:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
}; 