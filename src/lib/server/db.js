import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // โหลด .env

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: 'xpost_app'
  });
}

export const User = mongoose.models.User || mongoose.model('Users', new mongoose.Schema({
  username: String,
  email: String,
  password: String
}));
