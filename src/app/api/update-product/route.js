import connectDB from '@/lib/db'; // Database connection
import Product from '@/models/Product'; // Product model

export async function GET(req) {
  try {
    await connectDB(); // Ensure the database is connected

    const { searchParams } = new URL(req.url); // Parse query parameters
    const id = searchParams.get('id'); // Product ID
    const price = searchParams.get('price'); // New price (optional)
    const description = searchParams.get('description'); // New description (optional)

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...(price && { price }), ...(description && { description }) },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating product:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
