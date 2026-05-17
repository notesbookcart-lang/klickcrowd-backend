import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        // In production, this secret should be in .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'klickcrowd_super_secret_key_2026');
        
        // Add user payload to request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
