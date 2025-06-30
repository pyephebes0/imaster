// src/routes/api/queue/cancel/+server.js
import { postQueue } from '$lib/server/queue';
import { json } from '@sveltejs/kit';
import { authUser } from '$lib/server/auth';
import { Post } from '$lib/server/models/Post.js';  // import model Post ของคุณ
import { connection } from '$lib/server/redisConnection.js'; // import redis client

export async function POST({ request }) {
  const user = await authUser(request);
  if (!user) return new Response('Unauthorized', { status: 401 });

  try {
    // ตั้ง flag หยุด loop ใน Redis
    await connection.set(`stop:${user._id.toString()}`, 'true');

    // ลบ job ที่ค้างอยู่ของ user
    const jobs = await postQueue.getJobs(['waiting', 'delayed']);
    const userJobs = jobs.filter(job => job.data.userId === user._id.toString());

    for (const job of userJobs) {
      await job.remove();
    }

    // อัปเดตสถานะ post ของ user ให้เป็น 'pending' หรือ 'รอทำงาน'
    await Post.updateMany(
      { userId: user._id },
      { $set: { status: 'ready' } }  // เปลี่ยนตามฟิลด์สถานะของคุณ
    );

    return json({ success: true, removedJobs: userJobs.length });
  } catch (err) {
    console.error('Error removing jobs or updating post:', err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
}


