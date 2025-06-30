import { json } from '@sveltejs/kit';
// import { User } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import { createToken } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  const { username, password } = await request.json();
  const user = await User.findOne({ username });
  if (!user) return new Response('Invalid username', { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return new Response('Invalid password', { status: 401 });

  const token = createToken(user);
  cookies.set('jwt', token, { path: '/', httpOnly: true });

  // ✅ ส่ง user._id กลับไป
  return json({ success: true, userId: user._id.toString() });
}
