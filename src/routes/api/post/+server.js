// src\routes\api\post\+server.js
import { postQueue } from '$lib/server/queue';  // import queue ที่คุณตั้งไว้
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

		// ลบ flag หยุด (หรือ set เป็น false) ทุกครั้งเมื่อเริ่มโพสต์ใหม่
    await connection.del(`stop:${user._id.toString()}`);

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

		let post;

		const existingPost = await Post.findOne({ userId: user._id });
		if (existingPost) {
      console.log('⚠️ ยูสเซอร์เคยโพสต์แล้ว กำลังอัปเดตโพสต์เดิม');

      if (image && image.size > 0) {
        imageUrl = await uploadImage(image);
      } else {
        imageUrl = ''; 
      }
      
      existingPost.content = content;
      existingPost.duration = duration;
      existingPost.imageUrl = imageUrl;
      existingPost.status = 'posted';
      existingPost.updatedAt = new Date();
      
      post = await existingPost.save();

    } else {
		  post = await Post.create({
				userId: user._id,           // ObjectId ของ user
				content: content,           // ข้อความโพสต์ (string) จำเป็นต้องมี
				duration: duration || 0,    // จำนวนเวลาหน่วยนาที (number) ถ้าไม่มีให้เป็น 0
				imageUrl: imageUrl || '',   // URL รูปภาพ (string) ถ้าไม่มีให้เป็นค่าว่าง
				// lastPostedAt ไม่ต้องส่งตอนสร้างใหม่ (default เป็น null)
				// createdAt ไม่ต้องส่งก็ได้ mongoose จะเซ็ตให้เอง
		  });
		}

		console.log('✅ บันทึกโพสต์สำเร็จ:', post);

    // **ส่ง job เข้า queue ให้ Worker ดึงโพสต์นี้ไปประมวลผลต่อ**
    await postQueue.add('post-job', {
			userId: user._id.toString(),
			postId: post._id.toString() // ✅ ส่งแค่ _id ไป
		}, {
			delay: (post.duration || 0) * 60 * 1000, // ❗ เปลี่ยน "นาที" เป็น "มิลลิวินาที"
			attempts: 3, // ✅ (Optional) retry 3 ครั้งถ้า fail
			backoff: 10000, // ✅ (Optional) รอ 10 วิ ก่อน retry
			removeOnComplete: false, // ❌ ไม่ลบ job หลังสำเร็จ
  		removeOnFail: false      // ❌ ไม่ลบ job หลัง fail
		});

		return json(post);

	} catch (error) {
		console.error('🚨 POST /api/post ERROR:', error);
		return new Response(
			JSON.stringify({ message: 'Internal Error', error: error.message }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
