import { json } from '@sveltejs/kit';
import { Post } from '$lib/server/models/Post';
import { authUser } from '$lib/server/auth';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const user = await authUser(request);
		if (!user) return json({ post: null }); // ✅ ตอบกลับ JSON แม้ไม่มี user

		const post = await Post.findOne({ userId: user._id });
		return json({ post: post || null }); // ✅ ตอบกลับ { post: null } หากไม่มีโพสต์
	} catch (err) {
		console.error('⚠️ Error fetching post:', err);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
