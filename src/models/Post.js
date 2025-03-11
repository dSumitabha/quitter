import mongoose from 'mongoose';

// Define schema
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    source: { type: Number, enum: [0, 1], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export the model, preventing overwrite if already created
module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);