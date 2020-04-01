import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UsersService } from '~/modules/users/users.service';
import { UserModel } from '~/modules/users/interfaces';
import { CreateUserDto } from '~/modules/users/dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.loadByEmail(email, true);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserModel) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const confirmToken = v4();
    const user = await this.usersService.create({
      ...createUserDto,
      confirmToken,
    });
    try {
      await this.sendRegisterEmail({
        ...createUserDto,
        confirmToken,
      });
    } catch (err) {
      user.delete();
      throw err;
    }
  }

  async sendRegisterEmail(createUserDto: CreateUserDto) {
    await this
      .mailerService
      .sendMail({
        to: createUserDto.email,
        from: this.configService.get<string>('EMAIL_SMTP_DEFAULT'),
        subject: 'Cadastro efetuado com sucesso ✔',
        template: 'welcome', // The `.pug` or `.hbs` extension is appended automatically.
        context: { // Data to be sent to template engine.
          ...createUserDto,
          frontEndUrl: this.configService.get<string>('FRONT_END_URL'),
        },
      });
  }

  async confirmEmailUser(token: string) {
    return this.usersService.confirmEmail(token);
  }
}
