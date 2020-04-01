
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthController } from './modules/auth/auth.controller';

import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { ResetPasswordController } from './modules/reset-password/reset-password.controller';

import { DbModule } from '~/config/db.module';
import { MailerModule } from '~/config/mailer.module';
import { SentryModule } from '~/config/sentry.module';
import { BullModule } from '~/config/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    MailerModule,
    SentryModule,
    UsersModule,
    AuthModule,
    BullModule('default'),
    ResetPasswordModule,
  ],
  controllers: [
    AuthController,
    ResetPasswordController,
  ],
  providers: [],
})
export class AppModule {}
