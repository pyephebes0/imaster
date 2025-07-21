import { connectDB, User } from '$lib/server/db.js'; // สมมติโมดูลเชื่อม MongoDB
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  await connectDB();

  const { userId } = await request.json();

  const user = await User.findById(userId);
  if (!user) return json({ error: 'User not found' }, { status: 404 });

  const now = new Date();

  // กรองก้อนเครดิตที่ยังไม่หมดอายุและมีเครดิตเหลือ
  let validBatches = user.creditBatches
    .filter(b => b.expireAt > now && b.amount > 0)
    .sort((a, b) => a.expireAt - b.expireAt);

  let remainingToUse = 5; // ใช้เครดิต 5 หน่วยต่อ 1 ครั้ง

  for (const batch of validBatches) {
    if (batch.amount >= remainingToUse) {
      batch.amount -= remainingToUse;
      remainingToUse = 0;
      break;
    } else {
      remainingToUse -= batch.amount;
      batch.amount = 0;
    }
  }

  if (remainingToUse > 0) {
    return json({ error: 'เครดิตไม่เพียงพอ หรือหมดอายุ' }, { status: 400 });
  }

  // อัพเดต user ใน DB
  await user.save();

  return json({ success: true, creditBatches: user.creditBatches });
}
