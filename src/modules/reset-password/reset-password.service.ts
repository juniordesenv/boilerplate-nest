import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  SendResetPasswordEmail,
  RequestResetPasswordRepository,
  ApplyResetPasswordRepository,
} from '~/modules/reset-password/interfaces';
import {
  RequestResetPasswordUserDto,
  ApplyResetPasswordUserDto,
} from '~/modules/reset-password/dto';
import { UsersService } from '~/modules/users/users.service';
import { ResetPassword } from '~/modules/reset-password/model/reset.password.model';
import { User } from '~/modules/users/model/user.model';

@Injectable()
export class ResetPasswordService implements
RequestResetPasswordRepository,
SendResetPasswordEmail,
ApplyResetPasswordRepository {
  constructor(
    @InjectModel('ResetPassword') private resetPassword: ReturnModelType<typeof ResetPassword>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    resetPasswordUserDto: RequestResetPasswordUserDto,
  ): Promise<ResetPassword | null> {
    const user = await this.usersService.loadByEmail(resetPasswordUserDto.email);
    if (!user) return null;
    const resetPassword = await this.resetPassword.create({ user: user._id });
    await this.sendResetPasswordEmail(user, resetPassword);
    return null;
  }


  async sendResetPasswordEmail(user: User, resetPassword: ResetPassword) {
    await this
      .mailerService
      .sendMail({
        to: user.email,
        from: this.configService.get<string>('EMAIL_SMTP_DEFAULT'),
        subject: 'Redefinição de Senha',
        template: 'reset-password', // The `.pug` or `.hbs` extension is appended automatically.
        context: { // Data to be sent to template engine.
          ...resetPassword,
          frontEndUrl: this.configService.get<string>('FRONT_END_URL'),
        },
      });
  }


  async updateByToken(
    applyPasswordUserDto: ApplyResetPasswordUserDto,
  ): Promise<null> {
    const resetPassword = await this.resetPassword.findOne({
      token: applyPasswordUserDto.token,
      usedIn: null,
      expiredAt: { $gte: new Date() },
    });
    if (!resetPassword) throw Error('ExpiredOrNotFound');
    const user = await this.usersService.loadById(resetPassword.user.toString());
    user.password = applyPasswordUserDto.password;
    await user.save();
    return null;
  }
}
