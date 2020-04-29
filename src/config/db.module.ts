
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const DbModule = TypegooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    if (configService.get<string>('NODE_ENV') !== 'test') return { uri: configService.get<string>('MONGODB_URI') };
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    return {
      uri,
    };
  },
  inject: [ConfigService],
});
