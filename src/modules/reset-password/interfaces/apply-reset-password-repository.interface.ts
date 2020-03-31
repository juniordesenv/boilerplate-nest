import { ApplyResetPasswordUserDto } from '~/modules/reset-password/dto';

export interface ApplyResetPasswordRepository {
  updateByToken(applyPasswordUserDto: ApplyResetPasswordUserDto): Promise<null>
}
