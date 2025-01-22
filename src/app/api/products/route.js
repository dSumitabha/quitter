import connectDB from '@/lib/db'; // Database connection
import Product from '@/models/Product'; // Product model

export async function GET() {
  try {
    await connectDB(); // Ensure the database is connected

    // Static demo product data
    const demoProduct = {
      name: "Wireless Headphones",
      price: 59.99,
      description: "Bluetooth-enabled headphones with noise cancellation",
      inStock: true
    };

    const newProduct = new Product(demoProduct); // Create a new product instance
    const savedProduct = await newProduct.save(); // Save to the database

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}