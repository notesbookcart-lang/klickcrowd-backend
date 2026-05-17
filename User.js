import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['requirement', 'offer', 'post', 'article'],
        default: 'post'
    },
    tags: {
        type: [String],
        default: []
    },
    author: {
        name: { type: String, required: true },
        company: { type: String },
        avatar: { type: String },
        verified: { type: Boolean, default: false }
    },
    stats: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        reposts: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;
