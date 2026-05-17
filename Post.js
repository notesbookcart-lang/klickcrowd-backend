import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['broadcast', 'alert', 'message'],
        default: 'broadcast'
    },
    isGlobal: {
        type: Boolean,
        default: false // If true, applies to all users (recipients array ignored)
    },
    targetRole: {
        type: String, // e.g., 'Exporter / Importer', empty means all roles if isGlobal is true
        default: ''
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
