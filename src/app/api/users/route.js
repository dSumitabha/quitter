import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read users from JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(jsonData);
    
    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load users' }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}