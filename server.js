import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/messages.js'; // Will create this
import initializeSocket from './socket.js'; // Will create this

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://klickcrowd.com", "https://www.klickcrowd.com"], // Frontend URLs
        methods: ["GET", "POST"]
    }
});

// Initialize socket events
initializeSocket(io);

// Middleware
app.use(cors()); // Allow React to communicate with Node
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('KlickCrowd API is running...');
});

// Database Connection
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_atlas_connection_string_here') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('✅ Connected to MongoDB Atlas');
            server.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error('❌ MongoDB Connection Error:', error.message);
        });
} else {
    console.warn('⚠️ WARNING: MONGO_URI is not set in .env file.');
    console.warn('Server started without database connection.');
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT} (NO DATABASE)`);
    });
}
