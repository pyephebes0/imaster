import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { TwitterApi } from 'twitter-api-v2';
import mongoose from 'mongoose';

dotenv.config();

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/twitter-oauth',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'xpost_app'
  }
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Define TwitterAccount schema
const TwitterAccountSchema = new mongoose.Schema({
  userId: String,
  username: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Number
});
const TwitterAccount = mongoose.model('TwitterAccount', TwitterAccountSchema);

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const callbackURL = 'http://localhost:3000/twitter/callback';

app.get('/test-session', (req, res) => {
  req.session.test = 'hello';
  res.send('Session set');
});

app.get('/twitter/auth', async (req, res) => {
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(callbackURL, {
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  });

  req.session.codeVerifier = codeVerifier;
  req.session.state = state;

  res.redirect(url);
});

app.get('/twitter/callback', async (req, res) => {
  const { state, code } = req.query;

  console.log('Callback query:', req.query);
  console.log('Session state:', req.session?.state);
  console.log('Session verifier:', req.session?.codeVerifier);

  if (!state || !code) return res.status(400).send('Missing code or state');
  if (state !== req.session.state) return res.status(400).send('State mismatch');

  try {
    const result = await client.loginWithOAuth2({
      code,
      codeVerifier: req.session.codeVerifier,
      redirectUri: callbackURL,
    });

    const { client: loggedClient, accessToken, refreshToken, expiresIn } = result;
    const { data: user } = await loggedClient.v2.me();

    const twitterData = {
      userId: user.id,
      username: user.username,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    // ✅ Save to MongoDB
    await TwitterAccount.findOneAndUpdate(
      { userId: twitterData.userId },
      twitterData,
      { upsert: true, new: true }
    );

    // 🔁 Store in session (optional)
    if (!req.session.twitterAccounts) req.session.twitterAccounts = [];
    req.session.twitterAccounts.push(twitterData);

    res.redirect('http://localhost:5173/twitter/success');
  } catch (error) {
    console.error('OAuth failed', error);
    res.status(500).send('OAuth failed');
  }
});

app.get('/twitter/accounts', async (req, res) => {
  // ✅ Return from DB
  const accounts = await TwitterAccount.find({});
  res.json(accounts);
});

// DELETE /twitter/account/:userId
app.delete('/twitter/account/:userId', async (req, res) => {
  try {
    const result = await TwitterAccount.deleteOne({ userId: req.params.userId });
    if (result.deletedCount === 0) {
      return res.status(404).send('Account not found');
    }
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).send('Failed to delete');
  }
});

app.listen(3000, () => console.log('✅ Backend listening on http://localhost:3000'));
