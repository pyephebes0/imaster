import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // 🔥 สำคัญมาก!

const SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
