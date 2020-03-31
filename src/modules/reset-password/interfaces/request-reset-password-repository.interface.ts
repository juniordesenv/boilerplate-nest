import { RequestResetPasswordUserDto } from '~/modules/reset-password/dto';

export interface RequestResetPasswordRepository {
  create(resetPasswordUserDto: RequestResetPasswordUserDto): Promise<null>
}
