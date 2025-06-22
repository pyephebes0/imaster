// src/lib/server/models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
	content: String,
	duration: String,
	imageUrl: String,
	createdAt: { type: Date, default: Date.now }
});

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
