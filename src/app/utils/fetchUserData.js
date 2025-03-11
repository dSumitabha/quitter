import { cookies } from 'next/headers';

export async function fetchUserData() {
  const token = cookies().get('token')?.value;

  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }

  return res.json();
}