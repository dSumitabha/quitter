import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  inStock: { type: Boolean, default: true },
});

// Use an existing model if already declared, otherwise create it
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
