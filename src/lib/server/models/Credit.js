import mongoose from 'mongoose';

const CreditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true, min: 0 },    // เครดิตที่เหลืออยู่ในก้อนนี้
  expireAt: { type: Date, required: true },            // วันหมดอายุเครดิตก้อนนี้
  createdAt: { type: Date, default: Date.now }
});

export const Credit = mongoose.model('Credit', CreditSchema);
