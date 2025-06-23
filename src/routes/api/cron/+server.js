import mongoose from 'mongoose';
import { connectDB } from '$lib/server/db';
import { Post } from '$lib/server/models/Post';

export async function POST({ request }) {
  try {
    console.log('Cron job triggered at', new Date().toISOString());

    const body = await request.json();
    const postId = body.postId;

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing postId' }), { status: 400 });
    }

    await connectDB();

    // แปลง postId (string) เป็น ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return new Response(JSON.stringify({ error: 'Invalid postId format' }), { status: 400 });
    }
    const objectId = new mongoose.Types.ObjectId(postId);

    const post = await Post.findOne({ _id: objectId }).lean();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        data: post
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in cron job:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
