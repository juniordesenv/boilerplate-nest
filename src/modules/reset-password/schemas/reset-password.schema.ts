/* eslint-disable no-param-reassign */
import * as mongoose from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';

const ResetPasswordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  token: { type: String, required: false },
  usedIn: { type: Date, required: false },
  expiredAt: { type: Date, required: false },
}, {
  timestamps: true,
});

// eslint-disable-next-line func-names
ResetPasswordSchema.pre('save', function (next) {
  this.token = v4();
  this.expiredAt = addHours(new Date(), 8);
  next();
});

export { ResetPasswordSchema };
