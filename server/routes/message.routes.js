import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import FeedBack from '../models/FeedBack.js';

const router = express.Router();

// Get all messages (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await FeedBack.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// Create a new message
router.post('/', async (req, res) => {
    try {
        const message = new FeedBack(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ message: "Error creating message" });
    }
});

// Update message read status
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const message = await FeedBack.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json(message);
    } catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({ message: "Error updating message" });
    }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
    try {
        const message = await FeedBack.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: "Error deleting message" });
    }
});

export default router; 