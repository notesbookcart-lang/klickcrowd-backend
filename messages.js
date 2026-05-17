import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Middleware to ensure all routes here are admin only
router.use(adminAuth);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        
        // Count users by role
        const roleDistribution = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ totalUsers, totalPosts, roleDistribution });
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Toggle user verification status
router.put('/users/:id/verify', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.verified = !user.verified;
        await user.save();

        res.json({ message: 'User verification toggled', verified: user.verified });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/broadcast
// @desc    Send an in-app broadcast notification
router.post('/broadcast', async (req, res) => {
    try {
        const { message, targetRole } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const notification = new Notification({
            sender: req.user._id,
            message,
            type: 'broadcast',
            isGlobal: true,
            targetRole: targetRole || '' // If empty, goes to everyone
        });

        await notification.save();

        res.json({ message: 'Broadcast sent successfully', notification });
    } catch (err) {
        res.status(500).json({ message: 'Server error sending broadcast' });
    }
});

export default router;
