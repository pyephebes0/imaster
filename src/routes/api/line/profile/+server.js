export async function GET({ cookies }) {
  const userCookie = cookies.get('user');
  if (userCookie) {
    return new Response(userCookie, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(null, { status: 401 });
}
