import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordService } from './reset-password.service';
import { UsersModule } from '~/modules/users/users.module';
import { ResetPasswordController } from '~/modules/reset-password/reset-password.controller';
import { ResetPassword } from '~/modules/reset-password/model/reset.password.model';

@Module({
  imports: [
    TypegooseModule.forFeature([ResetPassword]),
    UsersModule,
    ConfigService,
  ],
  providers: [
    ResetPasswordService,
    ConfigService,
  ],
  controllers: [ResetPasswordController],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
