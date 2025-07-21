import mongoose from 'mongoose';

const CreditHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  batchId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Credit' },  // ก้อนเครดิตที่ทำรายการ
  action: { type: String, required: true, enum: ['add', 'use'] },
  before: { type: Number, required: true },    // เครดิตก่อนทำรายการ
  change: { type: Number, required: true },    // จำนวนเครดิตที่เพิ่ม(บวก)/ใช้(ลบ)
  after: { type: Number, required: true },     // เครดิตหลังทำรายการ
  userTotalBefore: { type: Number },            // (optional) เครดิตรวมผู้ใช้ก่อนรายการนี้
  userTotalAfter: { type: Number },             // (optional) เครดิตรวมผู้ใช้หลังรายการนี้
  date: { type: Date, default: Date.now }
});

export const CreditHistory = mongoose.model('CreditHistory', CreditHistorySchema);
