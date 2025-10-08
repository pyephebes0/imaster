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
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  // ✅ รองรับทั้ง jwt และ jwt_line
  const match = cookieHeader.match(/(?:jwt_line|jwt)=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  // รองรับ user จากทั้งระบบปกติและ LINE
  return {
    _id: payload.id,
    username: payload.username || payload.name || 'LINE_USER',
    email: payload.email || null,
    provider: payload.provider || (cookieHeader.includes('jwt_line') ? 'line' : 'local')
  };
}