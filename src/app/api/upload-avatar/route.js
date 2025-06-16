import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// You can move this to a shared util
function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return new TextEncoder().encode(secret);
}

export async function POST(req) {
  try {
    // ---- Step 1: Verify JWT from cookies ----
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      const { payload: decoded } = await jwtVerify(token, getJwtSecretKey());
      payload = decoded;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    // ---- Step 2: Get FormData and validate file ----
    const formData = await req.formData();
    const file = formData.get('avatar');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > maxSize) {
      return NextResponse.json({ error: 'Image must be less than 2MB' }, { status: 400 });
    }

    // ---- Step 3: Generate filename and save file ----
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'avatar', filename);

    await writeFile(filePath, buffer);

    // ---- Step 4: Return filename ----
    return NextResponse.json({ image: filename }, { status: 200 });

  } catch (err) {
    console.error('Upload avatar error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
