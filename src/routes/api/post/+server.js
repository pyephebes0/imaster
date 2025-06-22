import { json } from '@sveltejs/kit';
import { Post } from '$lib/server/models/Post';
import { authUser } from '$lib/server/auth';
import { uploadImage } from '$lib/server/upload';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const user = await authUser(request);
		if (!user) {
			console.warn('🛑 ไม่มี user');
			return new Response('Unauthorized', { status: 401 });
		}

    const formData = await request.formData();
		const content = formData.get('content');
		const duration = formData.get('duration');
		const image = formData.get('image');

    let imageUrl = '';
		if (image && image.size > 0) {
			imageUrl = await uploadImage(image);
			console.log('✅ อัปโหลดแล้ว imageUrl =', imageUrl);
		}

		console.log('📨 content:', content);
		console.log('⏱ duration:', duration);
		console.log('🖼 image name:', image?.name);

		const existingPost = await Post.findOne({ userId: user._id });
		if (existingPost) {
      console.log('⚠️ ยูสเซอร์เคยโพสต์แล้ว กำลังอัปเดตโพสต์เดิม');

      if (image && image.size > 0) {
        imageUrl = await uploadImage(image);  // <-- imageUrl ยังไม่ได้ประกาศ
      }else {
        imageUrl = ''; // ไม่ได้ส่งรูป → ลบรูปเก่า (ตั้งค่าเป็นค่าว่าง)
      }
      
      existingPost.content = content;
      existingPost.duration = duration;
      existingPost.imageUrl = imageUrl;
      existingPost.updatedAt = new Date();
      
      await existingPost.save();
      
      return json(existingPost);
    }

		const post = await Post.create({
			userId: user._id,
			content,
			duration,
			imageUrl,
			createdAt: new Date()
		});

		console.log('✅ สร้างโพสต์สำเร็จ:', post);

		return json(post);
	} catch (error) {
		console.error('🚨 POST /api/post ERROR:', error);
		return new Response(
			JSON.stringify({ message: 'Internal Error', error: error.message }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
