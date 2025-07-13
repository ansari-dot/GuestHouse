import express from 'express';
import { addRooms, getRooms, updateRoom, deleteRoom, filterRooms, getNextRoomNumber } from '../controllers/rooms.js';
import { uploadSingleImage } from '../utils/multer.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// to get next available room number
router.get('/nextRoomNumber', auth, getNextRoomNumber);

// to add the rooms
router.post('/addRooms', auth, uploadSingleImage, addRooms);

// to get the rooms
router.get('/getRooms', getRooms);

// to edit or update rooms
router.put('/rooms/:id', auth, uploadSingleImage, updateRoom);

// to delete rooms
router.delete('/deleteRoom/:id', auth, deleteRoom);

// to filter rooms
router.get('/filterRooms', filterRooms);

export default router;