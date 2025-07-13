 import express from "express";
 import dotenv from "dotenv";
 import connectDB from "./config/db.js";
 //import helmet from 'helmet';
 import cors from 'cors';
 import cookieParser from "cookie-parser";
 import path from "path";
 import fs from "fs";
 import { fileURLToPath } from "url";
 import rateLimit from 'express-rate-limit';
 import compression from 'compression';
 import morgan from 'morgan';

 // Routes import
 import UserRoutes from './routes/user.routes.js'
 import RoomsRoutes from './routes/rooms.routes.js'
 import FeedbackRoutes from './routes/feedback.routes.js'
 import { auth } from './middlewares/authMiddleware.js';
 import dashboardRoutes from './routes/dashboard.routes.js';
 import bookingRoutes from './routes/booking.routes.js';
 import messageRoutes from './routes/message.routes.js';
 import adminRoutes from './routes/admin.routes.js';
 import pdfRoutes from './routes/pdf.routes.js';

 dotenv.config();

 const __filename = fileURLToPath(
     import.meta.url);
 const __dirname = path.dirname(__filename);

 const app = express();

 // Security middleware
 /*app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000"],
      },
    },
  })); */
  

 // Rate limiting
 const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
 });
 app.use(limiter);

 // CORS middleware for all routes
 app.use(cors({
     origin: process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`,
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

 // Additional CORS handling for preflight requests
 app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`);
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
 app.use(compression()); // Compress all responses
 app.use(morgan('dev')); // Logging
 app.use(cookieParser());
 app.use(express.json({ limit: '10mb' }));
 app.use(express.urlencoded({ extended: true, limit: '10mb' }));

 // Static files
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 // Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Image serving with error handling - moved before catch-all
app.get('/api/image/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Image not found: ${req.params.filename}`);
            return res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});

// DB connect
connectDB();

// API Routes
app.use('/api', UserRoutes);
app.use('/api', RoomsRoutes);
app.use('/api', FeedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', adminRoutes);
app.use('/api/pdf', pdfRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API test route works' });
});

// Protected routes
app.get('/api/dashboard', auth, (req, res) => {
    res.json({ message: 'Dashboard data' });
});

app.get('/api/getFeedback', auth, (req, res) => {
    res.json({ message: 'Feedback data' });
});

// Health check endpoint
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

// Catch-all route to serve React app for any non-API route (must be last)
app.get('*', (req, res) => {
    // Skip API routes, uploads, and health check
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});