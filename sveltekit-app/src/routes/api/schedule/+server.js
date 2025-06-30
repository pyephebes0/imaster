import { json } from '@sveltejs/kit';
import { agendaPromise } from '$lib/server/agenda';

export async function POST({ request }) {
  const { text, accounts, delayInSec } = await request.json();

  if (!text || !accounts || !Array.isArray(accounts)) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }

  try {
    const agenda = await agendaPromise;  // ต้อง await เพื่อรอ instance จริง
    const job = agenda.create('post tweet', { text, accounts });
    job.schedule(new Date(Date.now() + delayInSec * 1000));
    await job.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Failed to schedule job:', err);
    return new Response(JSON.stringify({ error: 'Failed to schedule job', detail: err.message }), { status: 500 });
  }
}