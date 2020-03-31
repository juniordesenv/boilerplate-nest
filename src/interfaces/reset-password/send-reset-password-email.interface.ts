import { ResetPasswordModel } from './reset-password-model.interface';
import { UserModel } from '../users/user-model.interface';

export interface SendResetPasswordEmail {
  sendResetPasswordEmail(user: UserModel, resetPassword: ResetPasswordModel): Promise<void>
}
