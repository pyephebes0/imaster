import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
}

// ตรวจสอบให้แน่ใจว่ามี export ด้วย
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

/** ฟังก์ชันตรวจสอบ user จาก request (cookie) */
export async function authUser(request) {
  // ดึง cookie จาก request header
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  // หา cookie ชื่อ jwt (หรือชื่อที่คุณตั้งไว้)
  const match = cookieHeader.match(/jwt=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  // สมมุติ payload = { id, username }
  // ถ้าใช้ DB ให้ fetch user จาก id ด้วย
  // เช่น
  // const user = await User.findById(payload.id);
  // return user;

  // หรือถ้าไม่มี DB mock user object
  return { _id: payload.id, username: payload.username };
}