import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import helmet from 'helmet';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

// Routes import
import UserRoutes from './routes/user.routes.js';
import RoomsRoutes from './routes/rooms.routes.js';
import FeedbackRoutes from './routes/feedback.routes.js';
import { auth } from './middlewares/authMiddleware.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import messageRoutes from './routes/message.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// CORS middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://68728fee15a7258f65d0d8a9--sage-panda-b87a5d.netlify.app',
        'https://sage-panda-b87a5d.netlify.app', // Add production Netlify domain if available
        'https://meee-4gerxcsv.b4a.run', // Add deployed backend domain for completeness
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Additional CORS headers
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://68728fee15a7258f65d0d8a9--sage-panda-b87a5d.netlify.app',
        'https://sage-panda-b87a5d.netlify.app', // Add production Netlify domain if available
        'https://meee-4gerxcsv.b4a.run', // Add deployed backend domain for completeness
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve uploaded images with error check
app.get('/image/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Image not found: ${req.params.filename}`);
            return res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});

// Connect MongoDB
connectDB();

// Routes
app.use('/api', UserRoutes);
app.use('/api', RoomsRoutes);
app.use('/api', FeedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', adminRoutes);

// Protected Routes
app.get('/api/dashboard', auth, (req, res) => {
    res.json({ message: 'Dashboard data' });
});

app.get('/api/getFeedback', auth, (req, res) => {
    res.json({ message: 'Feedback data' });
});

// ✅ Add root route for `/`
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ✅ Serve frontend (if using React - adjust `client/dist` or `client/build`)
const clientPath = path.join(__dirname, 'client', 'dist'); // or 'build' if using CRA
if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientPath, 'index.html'));
    });
}

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// Start server
const PORT = process.env.PORT || "https://house-e4xk13qg.b4a.run/ ";
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
