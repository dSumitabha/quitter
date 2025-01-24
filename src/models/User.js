import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    role: { type: String, enum: ['admin', 'user'], },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields  
  }
);

// Export the model if not already created (to prevent model overwrite error)
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
