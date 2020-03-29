
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

import { DbModule } from '~/config/db.module';
import { MailerModule } from '~/config/mailer.module';
import { SentryModule } from '~/config/sentry.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    MailerModule,
    SentryModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [],
})
export class AppModule {}
