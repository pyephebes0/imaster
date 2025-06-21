import { TwitterApi } from 'twitter-api-v2';
import { redirect } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const callbackUrl = process.env.TWITTER_CALLBACK_URL;

export async function GET() {
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(callbackUrl, {
    scope: ['tweet.read', 'users.read', 'offline.access']
  });

  // ส่ง codeVerifier และ state ไปใน cookie
  return new Response(null, {
    status: 302,
    headers: {
      location: url,
      'Set-Cookie': [
        `code_verifier=${codeVerifier}; Path=/; HttpOnly`,
        `oauth_state=${state}; Path=/; HttpOnly`
      ]
    }
  });
}
