import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  gamerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameDetail: { type: String, required: true },
  inGameUserId: { type: String, required: true },
  screenshotUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const recruitmentSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: String, required: true },
  requirement: { type: String, required: true },
  contactInfo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  responses: [responseSchema],
  isOpen: { type: Boolean, default: true },
});

export const Recruitment = mongoose.model('Recruitment', recruitmentSchema); 