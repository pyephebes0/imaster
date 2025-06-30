// import bcrypt from 'bcryptjs';
// // import { connectDB } from '$lib/server/db';
// // import { User } from '$lib/server/db';
// // import { Post } from '$lib/server/models/Post'; // สมมุติว่า Post เก็บ userId

// export async function POST({ request }) {
//   try {
//     console.log('Admin check triggered at', new Date().toISOString());

//     const body = await request.json();
//     const { admin, password, username } = body;

//     if (!admin || !password || !username) {
//       return new Response(JSON.stringify({ error: 'Missing admin, password or username' }), { status: 400 });
//     }

//     await connectDB();

//     // เช็ค admin
//     const adminUser = await User.findOne({ username: admin }).lean();
//     if (!adminUser) {
//       return new Response(JSON.stringify({ error: 'Admin user not found' }), { status: 404 });
//     }

//     // เช็ค password admin
//     const passwordMatch = await bcrypt.compare(password, adminUser.password);
//     if (!passwordMatch) {
//       return new Response(JSON.stringify({ error: 'Invalid admin password' }), { status: 401 });
//     }

//     // เช็ค isAdmin จริงไหม
//     if (!adminUser.isAdmin) {
//       return new Response(JSON.stringify({ error: 'User is not admin' }), { status: 403 });
//     }

//     // ดึง user ปกติจาก username
//     const normalUser = await User.findOne({ username, isAdmin: { $ne: true } }).lean();
//     if (!normalUser) {
//       return new Response(JSON.stringify({ error: 'User not found or is admin' }), { status: 404 });
//     }

//     // ดึงโพสต์ทั้งหมดของ user นี้ (ถ้าเก็บ userId)
//     const posts = await Post.find({ userId: normalUser._id }).lean();

//     // ตัด password ออกก่อนส่งกลับ
//     const { password: _, ...userWithoutPassword } = normalUser;

//     return new Response(
//       JSON.stringify({
//         status: 'success',
//         posts
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(
//       JSON.stringify({ status: 'error', message: error.message }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
