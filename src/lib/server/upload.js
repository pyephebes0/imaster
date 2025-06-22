import fs from 'fs';
import path from 'path';

export async function uploadImage(file) {
  const uploadsDir = path.resolve('static/uploads'); // static/ เป็น public folder ใน SvelteKit
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = path.extname(file.name);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);

  // 👇 frontend จะหาได้ที่ /uploads/ชื่อไฟล์
  return `/uploads/${fileName}`;
}

