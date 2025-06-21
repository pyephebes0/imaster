// src/hooks.server.js
import { verifyToken } from '$lib/server/auth';
import { connectDB } from '$lib/server/db.js';
import dotenv from 'dotenv';

dotenv.config();

export async function handle({ event, resolve }) {
  // 1. รอให้เชื่อมต่อฐานข้อมูลก่อนทุกครั้ง
  await connectDB();

  // 2. ดึง JWT จาก cookie
  const token = event.cookies.get('jwt');

  if (token) {
    try {
      // 3. verify token และเซ็ต locals.user
      const payload = verifyToken(token);
      event.locals.user = { id: payload.id };
    } catch (err) {
      console.warn('Invalid token', err);
      // ไม่เซ็ต user ถ้า token ผิดพลาด
    }
  }

  // 4. ดำเนินการต่อไปยัง route/endpoint
  return resolve(event);
}
