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
  const jwtNormal = event.cookies.get('jwt');
  const jwtLine = event.cookies.get('jwt_line');

  if (jwtNormal) {
    try {
      const payload = verifyToken(jwtNormal);
      event.locals.user = { id: payload.id, source: 'normal' };
    } catch (err) {
      console.warn('Invalid jwt token', err);
    }
  } else if (jwtLine) {
    try {
      const payload = verifyToken(jwtLine);
      event.locals.user = { id: payload.id, source: 'line' };
    } catch (err) {
      console.warn('Invalid jwt_line token', err);
    }
  }

  // 4. ดำเนินการต่อไปยัง route/endpoint
  return resolve(event);
}
