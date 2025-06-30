import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { ObjectId } from 'mongoose';
import { connectDB, TwitterAccount } from '$lib/server/db.js';

dotenv.config();

export async function GET({ url, locals, cookies }) {
  await connectDB();

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const codeVerifier = cookies.get('code_verifier');
  const storedState = cookies.get('oauth_state');

  const userId = locals.user?.id;
  if (!userId) return new Response('Unauthorized: not logged in', { status: 401 });
  // ถ้า userId ไม่ใช่ string ให้แปลงเป็น string
  const userIdStr = typeof userId === 'string' ? userId : userId.toString();
  if (!code || !state || !codeVerifier || state !== storedState) {
    return new Response('Invalid state or missing data', { status: 400 });
  }

  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET
  });

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL
    });

    const twitterUser = await loggedClient.v2.me();
    const twitterId = twitterUser.data.id;
    const twitterUsername = twitterUser.data.username;

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // ใช้ Mongoose Model ในการค้นหาและอัพเดตข้อมูล
    const existingAccount = await TwitterAccount.findOne({
      userId: userIdStr,
      twitterId
    });

    if (existingAccount) {
      existingAccount.username = twitterUsername;
      existingAccount.accessToken = accessToken;
      existingAccount.refreshToken = refreshToken;
      existingAccount.expiresAt = expiresAt;
      await existingAccount.save();
    } else {
      const newAccount = new TwitterAccount({
        userId,
        twitterId,
        username: twitterUsername,
        accessToken,
        refreshToken,
        expiresAt
      });
      await newAccount.save();
    }

    // ลบ cookie ที่ใช้สำหรับ OAuth หลังเสร็จงาน
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('Set-Cookie', 'code_verifier=; Max-Age=0; Path=/; HttpOnly');
    headers.append('Set-Cookie', 'oauth_state=; Max-Age=0; Path=/; HttpOnly');

    return new Response(null, {
      status: 303,
      headers: {
        Location: '/auth/twitter/success',
        'Set-Cookie': [
          'code_verifier=; Max-Age=0; Path=/; HttpOnly',
          'oauth_state=; Max-Age=0; Path=/; HttpOnly'
        ]
      }
    });
  } catch (err) {
    console.error('Twitter OAuth Error:', err);
    return new Response('Authentication failed', { status: 500 });
  }
}
