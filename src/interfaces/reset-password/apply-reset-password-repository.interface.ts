import { ApplyResetPasswordUserDto } from '~/dto/reset-password/apply-reset-password-user.dto';

export interface ApplyResetPasswordRepository {
  updateByToken(applyPasswordUserDto: ApplyResetPasswordUserDto): Promise<null>
}
