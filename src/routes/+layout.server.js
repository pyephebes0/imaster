// src/routes/+layout.server.js
import { verifyToken } from '$lib/server/auth'; // ฟังก์ชัน verifyToken ของคุณ

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const token = cookies.get('jwt');
  if (!token) return { user: null };

  const user = verifyToken(token);
  if (!user) return { user: null };

  // ส่งข้อมูล user กลับไปที่ layout
  return { user };
}
