import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordSchema } from '~/schemas/reset-password.schema';
import { UsersModule } from '~/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ResetPassword', schema: ResetPasswordSchema }]),
    UsersModule,
    ConfigService,
  ],
  providers: [
    ResetPasswordService,
    ConfigService,
  ],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
