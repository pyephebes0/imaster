import { verifyToken } from '$lib/server/auth';
import dotenv from 'dotenv';

dotenv.config();

export async function handle({ event, resolve }) {
  const token = event.cookies.get('jwt');

  if (token) {
    try {
      const payload = verifyToken(token);
      event.locals.user = { id: payload.id }; // ✅ เฉพาะ id ก็พอ
    } catch (err) {
      console.warn('Invalid token', err);
      // ไม่ต้อง set user ถ้า verify ไม่ผ่าน
    }
  }

  return resolve(event);
}
