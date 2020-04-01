
import { MailerService } from '@nestjs-modules/mailer';
import { getModelToken } from '@nestjs/mongoose';
import * as redis from 'redis-mock';
import { Collection } from 'mongoose';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserModel } from '../src/modules/users/interfaces';
import { ValidationPipe422 } from '../src/validation-pipe';

let app: INestApplication;

const mockMailerService = {
  sendMail: async () => new Promise((resolve) => resolve()),
};

export const defaultBeforeAll = async () => {
  await redis.createClient();
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailerService)
    .useValue(mockMailerService)
    .compile();


  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe422({
    transform: true,
  }));
  await app.init();

  const usersCollection: Collection<UserModel> = app.get<Collection<UserModel>>(getModelToken('User'));

  await usersCollection.deleteMany({});
  const user = await usersCollection.create({
    name: 'Test name',
    email: 'test@test.com',
    password: '123456',
  });

  return { app, usersCollection, user };
};
