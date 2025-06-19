import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  // ลบ cookie JWT
  cookies.delete('jwt', { path: '/' });

  // redirect ไปที่ /login
  throw redirect(302, '/login');
}
