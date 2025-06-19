import { json } from '@sveltejs/kit';
import { User } from '$lib/server/db';
import bcrypt from 'bcryptjs';

export async function POST({ request }) {
  const { username, email, password, confirm } = await request.json();
  if (password !== confirm) return new Response('Passwords do not match', { status: 400 });
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) return new Response('Username or email exists', { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash });
  return json({ success: true });
}
