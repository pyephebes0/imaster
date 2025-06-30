// src/routes/auth/twitter/accounts/+server.js
import { TwitterAccount } from '$lib/server/db.js';

export async function GET({ locals }) {
  const userId = locals.user?.id;
  if (!userId) return new Response('Unauthorized', { status: 401 });

  try {
    // ดึงบัญชี twitter ที่ user นี้เชื่อมไว้
    const accounts = await TwitterAccount.find({ userId }).select('twitterId username').lean();

    // แปลงข้อมูลให้เหมาะสม (แปลง _id เป็น string, ชื่อฟิลด์ตาม frontend)
    const formatted = accounts.map(acc => ({
      twitterUserId: acc.twitterId,
      username: acc.username
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching twitter accounts:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
