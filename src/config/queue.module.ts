import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule as NestBullModule } from '@nestjs/bull';

export const BullModule = (name: string) => NestBullModule.registerQueueAsync({
  name,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('QUEUE_HOST'),
      port: +configService.get('QUEUE_PORT'),
    },
  }),
  inject: [ConfigService],
});
