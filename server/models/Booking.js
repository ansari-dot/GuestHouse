import mongoose, { modelNames } from 'mongoose'
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 6, // Matches the UI's guest limit (1-6)
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[\d\s-]{7,15}$/, 'Please enter a valid phone number'],
    },
    specialRequests: {
        type: String,
        trim: true,
        default: '',
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'cash_on_arrival'],
    },
    paymentDetails: {
        cardNumber: {
            type: String,
            trim: true,
            required: function() {
                return this.paymentMethod === 'credit_card';
            },
        },
        expiryDate: {
            type: String,
            trim: true,
            required: function() {
                return this.paymentMethod === 'credit_card';
            },
            match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter a valid expiry date (MM/YY)'],
        },
        cvv: {
            type: String,
            trim: true,
            required: function() {
                return this.paymentMethod === 'credit_card';
            },
            match: [/^\d{3,4}$/, 'Please enter a valid CVV'],
        },
        paypalEmail: {
            type: String,
            trim: true,
            lowercase: true,
            required: function() {
                return this.paymentMethod === 'paypal';
            },
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid PayPal email address'],
        },
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Confirmed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` timestamp on save
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

bookingSchema.index({ checkIn: 1, checkOut: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;