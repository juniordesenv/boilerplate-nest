import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {
  RequestResetPasswordRepository,
} from '~/interfaces/reset-password';
import { RequestResetPasswordUserDto } from '~/dto/reset-password/request-reset-password-user.dto';
import { ResetPasswordModel } from '~/interfaces/reset-password/reset-password-model.interface';
import { UsersService } from '~/users/users.service';
import { UserModel } from '~/interfaces/users';
import { ApplyResetPasswordRepository } from '~/interfaces/reset-password/apply-reset-password-repository.interface';
import { SendResetPasswordEmail } from '~/interfaces/reset-password/send-reset-password-email.interface';
import { ApplyResetPasswordUserDto } from '~/dto/reset-password/apply-reset-password-user.dto';

@Injectable()
export class ResetPasswordService implements
RequestResetPasswordRepository,
SendResetPasswordEmail,
ApplyResetPasswordRepository {
  constructor(
    @InjectModel('ResetPassword') private resetPassword: Model<ResetPasswordModel>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    resetPasswordUserDto: RequestResetPasswordUserDto,
  ): Promise<ResetPasswordModel | null> {
    const user = await this.usersService.loadByEmail(resetPasswordUserDto.email);
    if (!user) return null;
    const resetPassword = await this.resetPassword.create({ user: user._id });
    await this.sendResetPasswordEmail(user, resetPassword);
    return null;
  }


  async sendResetPasswordEmail(user: UserModel, resetPassword: ResetPasswordModel) {
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
    const user: UserModel = await this.usersService.loadById(resetPassword.user);
    user.password = applyPasswordUserDto.password;
    user.save();
    return null;
  }
}
