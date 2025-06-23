import { connectDB } from '$lib/server/db';
import { authUser } from '$lib/server/auth';
import { Post } from '$lib/server/models/post';

export async function GET({ request }) {
  try {
    console.log('Cron job triggered at', new Date().toISOString());

    const user = await authUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await connectDB();

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `Found ${posts.length} posts`,
        data: posts
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
