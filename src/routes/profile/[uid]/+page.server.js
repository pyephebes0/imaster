import { verifyToken } from '$lib/server/auth';
import { User } from '$lib/server/db';
import { UserLine } from '$lib/server/models/UserLine';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, params }) {
  const jwtToken = cookies.get('jwt');
  const jwtLineToken = cookies.get('jwt_line');

  let auth;
  let user;
  let userId = params.uid;
  let isLineUser = false;

  if (jwtToken) {
    auth = verifyToken(jwtToken);
    if (!auth) throw redirect(302, '/login');

    user = await User.findById(userId).lean();
    if (!user) throw redirect(302, '/login');
  } else if (jwtLineToken) {
    auth = verifyToken(jwtLineToken);
    if (!auth) throw redirect(302, '/login');

    user = await UserLine.findById(userId).lean();
    if (!user) throw redirect(302, '/login');

    isLineUser = true;
  } else {
    // ไม่มี cookie เลย
    throw redirect(302, '/login');
  }

  user._id = user._id.toString();

  return { user, isLineUser };
}
