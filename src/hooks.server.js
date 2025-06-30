// src/hooks.server.js
import { verifyToken } from '$lib/server/auth';
import { connectDB } from '$lib/server/db';
import { connection } from '$lib/server/redisConnection'; // <-- เพิ่มบรรทัดนี้

import dotenv from 'dotenv';

dotenv.config();

export async function handle({ event, resolve }) {
  // เชื่อมต่อฐานข้อมูล
  await connectDB();

   // -- Redis connection จะเชื่อมต่อและ log ตอน import ไฟล์นี้ --
  // ถ้าต้องการทดสอบ set/get เพิ่มใน redisConnection.js ได้เลย

  // ดึง JWT จาก cookie
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
