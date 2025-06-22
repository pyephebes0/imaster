import { json } from '@sveltejs/kit';
import { Post } from '$lib/server/models/Post';
import { authUser } from '$lib/server/auth';

export async function GET({ request }) {
  const user = await authUser(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const post = await Post.findOne({ userId: user._id });
  if (!post) {
    return new Response(null, { status: 204 }); // No Content
  }

  return json(post);
}
