import { RequestResetPasswordUserDto } from '~/modules/reset-password/dto';
import { ResetPassword } from '~/modules/reset-password/model/reset.password.model';

export interface RequestResetPasswordRepository {
  create(resetPasswordUserDto: RequestResetPasswordUserDto): Promise<null | ResetPassword>
}
