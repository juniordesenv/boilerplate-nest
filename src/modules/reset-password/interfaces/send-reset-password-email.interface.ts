import { User } from '~/modules/users/model/user.model';
import { ResetPassword } from '~/modules/reset-password/model/reset.password.model';

export interface SendResetPasswordEmail {
  sendResetPasswordEmail(user: User, resetPassword: ResetPassword): Promise<void>
}
