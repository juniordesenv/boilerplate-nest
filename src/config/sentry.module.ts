
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule as NestSentryModule } from '@ntegral/nestjs-sentry';

export const SentryModule = NestSentryModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    dsn: configService.get('SENTRY_DSN'),
    debug: true,
    environment: configService.get('NODE_ENV'),
  }),
  inject: [ConfigService],
});
