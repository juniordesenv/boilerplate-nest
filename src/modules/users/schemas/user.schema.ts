/* eslint-disable no-param-reassign */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  password: { type: String, required: true },
  verifiedEmail: { type: Boolean, required: true, default: false },
  confirmToken: { type: String, required: false },
}, {
  timestamps: true,
  toObject: {
    transform(doc: any, ret: any) {
      delete ret.password;
    },
  },
  toJSON: {
    transform(doc: any, ret: any) {
      delete ret.password;
      delete ret.confirmToken;
    },
  },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  const user = this;
  user.token = v4();
  if (user.password) {
    bcrypt.genSalt(9, (err, salt) => {
      if (err) next(err);
      else {
        bcrypt.hash(user.password, salt, (err2, hash) => {
          if (err2) next(err2);
          else {
            user.salt = salt;
            user.password = hash;
            next();
          }
        });
      }
    });
  }
});

export { UserSchema };
