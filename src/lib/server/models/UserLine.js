// src/lib/server/models/UserLine.js
import mongoose from 'mongoose';

const userLineSchema = new mongoose.Schema({
  lineId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: String,
  picture: String,
  provider: { type: String, default: 'line' }
}, {
  timestamps: true,
  versionKey: false
});

export const UserLine = mongoose.models.UserLine || mongoose.model('UserLine', userLineSchema);

