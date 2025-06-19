import { verifyToken } from '$lib/server/auth';
import { User } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, params }) {
  const token = cookies.get('jwt');
  const auth = verifyToken(token);

  if (!auth) throw redirect(302, '/login');

  const user = await User.findById(params.uid).lean();
  if (!user) throw redirect(302, '/login');

  user._id = user._id.toString();
  return { user };
}
