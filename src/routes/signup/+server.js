import { json } from '@sveltejs/kit';
// import { User } from '$lib/server/db';
import bcrypt from 'bcryptjs';

export async function POST({ request }) {
  const { username, email, password, confirm } = await request.json();

  // ✅ ตรวจสอบว่าทุกช่องถูกกรอก
  if (
    !username?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !confirm?.trim()
  ) {
    return new Response('All fields are required.', { status: 400 });
  }

  // ✅ ตรวจสอบว่ารหัสผ่านตรงกัน
  if (password !== confirm) {
    return new Response('Passwords do not match.', { status: 400 });
  }

  // ✅ ตรวจสอบซ้ำว่า username หรือ email ซ้ำ
  // const exists = await User.findOne({ $or: [{ username }, { email }] });
  // if (exists) {
  //   return new Response('Username or email already exists.', { status: 400 });
  // }

  // ✅ เข้ารหัสและบันทึกลงฐานข้อมูล
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username: username.trim(), email: email.trim(), password: hash });

  return json({ success: true });
}
