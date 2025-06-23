import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get room statistics
        const totalRooms = await Room.countDocuments();
        const availableRooms = await Room.countDocuments({ status: 'available' });
        const occupiedRooms = await Room.countDocuments({ status: 'occupied' });

        // Get booking statistics
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

        // Calculate total revenue
        const bookings = await Booking.find({ status: 'confirmed' });
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

        // Get message statistics
        const totalMessages = await Message.countDocuments();
        const unreadMessages = await Message.countDocuments({ read: false });

        // Get monthly revenue data for the last 6 months
        const monthlyRevenue = await Booking.aggregate([
            {
                $match: {
                    status: 'confirmed',
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get booking status distribution
        const bookingStatusDistribution = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get room type distribution
        const roomTypeDistribution = await Room.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format monthly revenue data
        const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
            name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
            revenue: item.revenue
        }));

        // Format booking status data
        const formattedBookingStatus = bookingStatusDistribution.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        }));

        // Format room type data
        const formattedRoomTypes = roomTypeDistribution.map(item => ({
            name: item._id,
            value: item.count
        }));

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
            },
            charts: {
                monthlyRevenue: formattedMonthlyRevenue,
                bookingStatus: formattedBookingStatus,
                roomTypes: formattedRoomTypes
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
}; 