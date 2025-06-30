import cron from 'node-cron';
// import { connectDB } from './db';
// import { Post } from '$lib/server/models/Post.js';
import { getTwitterAccountsByUserId } from '$lib/server/models/TwitterAccount.js';
import { PostLog } from '$lib/server/models/PostLog.js';
import { tweetToTwitterAccount } from '$lib/server/twitter-api/twitterClient';

cron.schedule('*/1 * * * *', async () => {
  try {
    await connectDB();

    // สมมติคุณจะทำให้ cron รันกับ user ทุกคนที่มีโพสต์
    const posts = await Post.find({});
    if (posts.length === 0) {
      console.log('No posts found.');
      return;
    }

    for (const post of posts) {
      const userId = post.userId;

      const twitterAccounts = await getTwitterAccountsByUserId(userId);
      if (twitterAccounts.length === 0) {
        console.log(`No twitter accounts connected for user ${userId}`);
        continue;
      }

      for (const account of twitterAccounts) {
        try {
          await tweetToTwitterAccount(account, post);

          await PostLog.create({
            postId: post._id,
            userId,
            twitterAccountId: account._id,
            status: 'success',
            tweetedAt: new Date()
          });

          console.log(`Posted successfully to @${account.username}`);

        } catch (error) {
          try {
            await PostLog.create({
              postId: post._id,
              userId,
              twitterAccountId: account._id,
              status: 'failed',
              errorMessage: error.message,
              tweetedAt: new Date()
            });
          } catch (logError) {
            console.error('Failed to write PostLog:', logError);
          }
          console.error(`Failed to post to @${account.username}`, error.message);
        }
      }
    }
  } catch (err) {
    console.error('Cron job error:', err);
  }
});
