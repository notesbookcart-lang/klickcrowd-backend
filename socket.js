import Message from './models/Message.js';

const initializeSocket = (io) => {
    // Keep track of connected users: { userId: socketId }
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // 1. User joins the socket network (sends their userId)
        socket.on('registerUser', (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                console.log(`👤 User ${userId} registered online with socket ${socket.id}`);
                // Broadcast to all clients who is online
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
        });

        // 2. Handle private messages
        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, text } = data;
            
            try {
                // Save message to database
                const newMessage = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    text
                });
                await newMessage.save();

                // Check if receiver is online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    // Send to receiver in real-time
                    io.to(receiverSocketId).emit('receiveMessage', newMessage);
                }
                
                // Also send it back to sender to confirm it was sent
                socket.emit('messageSent', newMessage);

            } catch (error) {
                console.error("❌ Error sending message:", error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });

        // 3. User disconnects
        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
            
            // Remove user from online tracking
            let disconnectedUserId = null;
            for (let [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            
            if (disconnectedUserId) {
                console.log(`👤 User ${disconnectedUserId} went offline`);
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
        });
    });
};

export default initializeSocket;
