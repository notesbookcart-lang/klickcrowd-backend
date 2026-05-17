import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        
        const user = await User.findById(verified.id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found, access denied' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};
