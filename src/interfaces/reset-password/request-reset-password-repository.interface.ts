import { RequestResetPasswordUserDto } from '~/dto/reset-password/request-reset-password-user.dto';

export interface RequestResetPasswordRepository {
  create(resetPasswordUserDto: RequestResetPasswordUserDto): Promise<null>
}
