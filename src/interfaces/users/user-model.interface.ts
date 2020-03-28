import { Document, model } from 'mongoose';

interface UserSchema extends Document {
  _id?: any;
  name: string;
  email: string;
  password; string;
  verifiedEmail: boolean;
}

export type UserModel = model<UserSchema>;
