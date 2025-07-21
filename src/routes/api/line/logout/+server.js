import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  // ลบ cookie JWT
  cookies.delete('jwt', { path: '/' });
  cookies.delete('user', { path: '/' });
  throw redirect(302, '/login');
}
