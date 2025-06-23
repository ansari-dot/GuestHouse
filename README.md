# Sardar House - Guest House Management System

A full-stack web application for managing a guest house with user authentication, room booking, and admin panel.

## Features

### User Features
- User registration and authentication
- Browse available rooms
- Book rooms with date selection
- View booking history
- User profile management
- Responsive design with dark/light mode

### Admin Features
- Admin dashboard with statistics
- Room management (add, edit, delete)
- Booking management
- Message management
- Revenue tracking
- User management

## Tech Stack

### Frontend
- React 19
- Redux Toolkit
- React Router DOM
- Bootstrap 5
- Framer Motion
- React Icons
- Recharts
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Nodemailer for emails
- PDFKit for PDF generation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd sardar-house
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/GuestHouse

# JWT Configuration
SECRET_KEY=your_secret_key_here

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Create Admin User

Run the admin creation script:

```bash
cd server
node createAdmin.js
```

This will create an admin user with:
- Email: admin@sardarhouse.com
- Password: admin123

### 5. Start the application

#### Start the backend server
```bash
cd server
npm run dev
```

#### Start the frontend development server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Usage

### For Users
1. Register a new account or login
2. Browse available rooms
3. Select dates and book a room
4. View your booking history in the profile section

### For Admins
1. Login with admin credentials
2. Access the admin dashboard
3. Manage rooms, bookings, and messages
4. View statistics and revenue reports

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/check` - Check authentication status

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin` - Admin verification

### Rooms
- `GET /api/getRooms` - Get all rooms
- `POST /api/addRooms` - Add new room (admin only)
- `DELETE /api/deleteRoom/:id` - Delete room (admin only)

### Bookings
- `POST /api/booking` - Create booking
- `GET /api/get/booking` - Get all bookings
- `GET /api/booking/:id/status` - Get booking status
- `GET /api/user/bookings` - Get user bookings

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/rooms` - Get recent rooms
- `GET /api/dashboard/bookings` - Get recent bookings
- `GET /api/dashboard/messages` - Get recent messages

## Project Structure

```
sardar-house/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── public/            # Static files
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team. 