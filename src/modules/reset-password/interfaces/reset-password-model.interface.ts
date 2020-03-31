import { Document, model } from 'mongoose';
import { UserModel } from '~/modules/users/interfaces';

interface ResetPasswordSchema extends Document {
  _id?: any;
  user: UserModel | string;
  token: string;
  usedIn?: Date;
  expiredAt: Date;
}

export type ResetPasswordModel = model<ResetPasswordSchema>;
