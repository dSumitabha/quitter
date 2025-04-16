import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.models.Like || mongoose.model('Like', likeSchema);