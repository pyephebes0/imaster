// src/routes/api/queue/+server.js
import { postQueue } from '$lib/server/queue';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    // ดึง jobs ทั้งหมดที่ยังรออยู่ (waiting/delayed)
    const jobs = await postQueue.getJobs(['waiting', 'delayed']);

    // แปลง jobs เป็นข้อมูลที่เราต้องการ
    const jobList = jobs.map(job => ({
      id: job.id,
      name: job.name,
      userId: job.data.userId,
      postId: job.data.postId,
      delayUntil: job.timestamp + (job.opts.delay || 0),
      status: job.opts.delay > 0 ? 'delayed' : 'waiting'
    }));

    return json({ jobs: jobList });

  } catch (err) {
    console.error('❌ Error fetching jobs from queue:', err);
    return json({ message: 'Failed to fetch jobs', error: err.message }, { status: 500 });
  }
}