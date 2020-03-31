
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ResetPasswordController } from './reset-password/reset-password.controller';

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
    AppController,
    AuthController,
    ResetPasswordController,
  ],
  providers: [],
})
export class AppModule {}
