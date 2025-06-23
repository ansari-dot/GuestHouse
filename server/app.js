import dashboardRoutes from './routes/dashboardRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes); 