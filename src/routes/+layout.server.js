// src/routes/+layout.server.js
import { verifyToken } from '$lib/server/auth'; // ฟังก์ชัน verifyToken ของคุณ

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const token = cookies.get('jwt');
  const tokenLine = cookies.get('jwt_line');

  let user = null;

  if (token) {
    user = verifyToken(token);
  } else if (tokenLine) {
    user = verifyToken(tokenLine);
  }

  // ถ้า verify ไม่ผ่าน หรือไม่มี token เลย ก็ส่ง user: null
  if (!user) {
    return { user: null };
  }

  return { user };
}
