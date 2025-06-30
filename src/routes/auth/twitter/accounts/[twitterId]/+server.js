// src/routes/twitter/account/[twitterId]/+server.js
// import { TwitterAccount } from '$lib/server/db.js';

export async function DELETE({ params, locals }) {
  const userId = locals.user?.id;
  if (!userId) return new Response('Unauthorized', { status: 401 });

  try {
    const twitterId = params.twitterId;
    const result = await TwitterAccount.deleteOne({ userId, twitterId });

    if (result.deletedCount === 0) {
      return new Response('Account not found or unauthorized', { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Delete account error:', err);
    return new Response('Failed to delete', { status: 500 });
  }
}
