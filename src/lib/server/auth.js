// $lib/server/auth.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  if (!SECRET) throw new Error('JWT_SECRET is not set');

  const payload = {
    userId: user._id.toString(),
    username: user.username
  };

  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}
