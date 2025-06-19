import { verifyToken } from '$lib/server/auth';

export async function handle({ event, resolve }) {
  const token = event.cookies.get('jwt');
  if (token) {
    event.locals.user = verifyToken(token);
  }
  return resolve(event);
}
