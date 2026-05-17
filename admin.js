import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        required: true,
        enum: [
            'Individual',
            'Business Owner',
            'Exporter / Importer',
            'CHA / Freight Forwarder',
            'Transporter',
            'Commission Agent',
            'Financial Institution / Banker',
            'Manufacturer',
            'Service Provider',
            'Farmer - Local Mandi',
            'Professional CA/CS/CMA',
            'Designer / Creator',
            'Other'
        ]
    },
    avatar: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
