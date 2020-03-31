import { ResetPasswordModel } from '~/modules/reset-password/interfaces/reset-password-model.interface';
import { UserModel } from '~/modules/users/interfaces/user-model.interface';

export interface SendResetPasswordEmail {
  sendResetPasswordEmail(user: UserModel, resetPassword: ResetPasswordModel): Promise<void>
}
