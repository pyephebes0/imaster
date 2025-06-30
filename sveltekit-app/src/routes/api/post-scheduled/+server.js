// src/routes/api/post-scheduled/+server.js
import { json } from '@sveltejs/kit';
import { getPostsToPost, doPost } from '$lib/db-and-posting.js';

export async function POST() {
  // ดึงข้อมูลโพสต์ที่ต้องโพสต์
  const posts = await getPostsToPost();

  // โพสต์แต่ละโพสต์
  for (const post of posts) {
    await doPost(post);
  }

  return json({ success: true, posted: posts.length });
}
