/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import * as request from 'supertest';
import { Collection } from 'mongoose';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getModelToken } from '@nestjs/mongoose';
import * as redis from 'redis-mock';
import { AppModule } from '../src/app.module';
import { UserModel } from '~/modules/users/interfaces';
import { ValidationPipe422 } from '~/validation-pipe';

describe('AuthController (e2e)', () => {
  let app: INestApplication;


  let usersCollection: Collection<UserModel>;

  const mockMailerService = {
    sendMail: async () => new Promise((resolve) => resolve()),
  };

  beforeAll(async () => {
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

    usersCollection = app.get<Collection<UserModel>>(getModelToken('User'));

    await usersCollection.deleteMany({});
    await usersCollection.create({
      name: 'Test name',
      email: 'test@test.com',
      password: '123456',
    });
  });

  it('/auth/registry (POST)', () => request(app.getHttpServer())
    .post('/auth/registry')
    .send({ name: 'Test name', email: 'jr.miranda@outlook.com', password: '123456' })
    .expect(201)
    .expect('Cadastro efetuado com sucesso!'));

  it('/auth/registry (POST)', () => request(app.getHttpServer())
    .post('/auth/registry')
    .send({ email: 'jr.miranda@outlook.com', password: '123456' })
    .expect(422));

  it('/auth/registry (POST)', () => request(app.getHttpServer())
    .post('/auth/registry')
    .send({ name: 'Test name', email: 'test@test.com', password: '123456' })
    .expect(400)
    .expect({ status: 400, error: 'Email já cadastrado!' }));
});
