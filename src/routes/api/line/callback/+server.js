import jwt from 'jsonwebtoken';
import { json, redirect } from '@sveltejs/kit';
import axios from 'axios';
import dotenv from 'dotenv';
import { UserLine } from '$lib/server/models/UserLine'; // ต้องมีโมเดล Mongoose หรือ DB client

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const REDIRECT_URI = process.env.LINE_REDIRECT_URI;

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');

  if (!code) {
    return json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // 1. ขอ access token จาก LINE
    const tokenResponse = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: LINE_CHANNEL_ID,
        client_secret: LINE_CHANNEL_SECRET
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const idToken = tokenResponse.data.id_token; // สำคัญสำหรับดึง email

    // 2. Decode id_token เพื่อเอา email
    const decoded = jwt.decode(idToken);
    const email = decoded?.email;

    // 3. ขอ profile เพิ่มเติม
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const profile = profileResponse.data;

    // 4. หรือล็อกไว้ตรงนี้
    if (!email) {
      return json({ error: 'Email permission is required from LINE' }, { status: 400 });
    }

    // 5. ตรวจสอบว่ามี user ที่ email นี้หรือยัง
    let user = await UserLine.findOne({ email });

    if (!user) {
      // ถ้ายังไม่มี => สร้าง user ใหม่
      user = await UserLine.create({
        email,
        lineId: profile.userId,
        name: profile.displayName,
        picture: profile.pictureUrl,
        provider: 'line'
      });
    } else {
      // ถ้ามี user แล้วแต่ยังไม่ผูก lineId
      if (!user.lineId) {
        user.lineId = profile.userId;
        await user.save();
      }
    }

    // 6. สร้าง JWT จาก user
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 7. ส่ง token เป็น cookie
    cookies.set('jwt_line', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    // Redirect ภายใน try block
    throw redirect(302, `/profile/${user._id}`);
  } catch (err) {
    // หากเป็น redirect ให้โยนต่อเลย
    if (err?.status === 302 && err?.location) {
      throw err;
    }

    // กรณีอื่นๆ แสดง error และส่ง response
    console.error('LINE login error:', err);
    return json({ error: 'Login failed' }, { status: 500 });
  }

}
