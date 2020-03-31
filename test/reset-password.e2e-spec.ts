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
import { ResetPasswordModel } from '~/modules/reset-password/interfaces';
import { UserModel } from '~/modules/users/interfaces';
import { ValidationPipe422 } from '~/validation-pipe';

describe('ResetPasswordController (e2e)', () => {
  let app: INestApplication;

  let resetPasswordsCollection: Collection<ResetPasswordModel>;
  let usersCollection: Collection<UserModel>;

  let resetPasswordDefault: ResetPasswordModel;

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

    resetPasswordsCollection = app.get<Collection<ResetPasswordModel>>(getModelToken('ResetPassword'));

    usersCollection = app.get<Collection<UserModel>>(getModelToken('User'));

    await usersCollection.deleteMany({});
    const user = await usersCollection.create({
      name: 'Test name',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    await resetPasswordsCollection.deleteMany({});
    resetPasswordDefault = await resetPasswordsCollection.create({
      user: user._id,
    });
  });

  it('/auth/reset-password (POST)', () => request(app.getHttpServer())
    .post('/auth/reset-password')
    .send({ email: 'teste@teste.com.br' })
    .expect(201)
    .expect('Solicitação efetuada com sucesso, verefique seu email!'));

  it('/auth/reset-password (PUT)', () => request(app.getHttpServer())
    .put(`/auth/reset-password/${resetPasswordDefault.token}`)
    .send({ password: 123456, passwordConfirm: 1234567 })
    .expect(422));

  it('/auth/reset-password (PUT)', () => request(app.getHttpServer())
    .put(`/auth/reset-password/${resetPasswordDefault.token}`)
    .send({ password: 123456, passwordConfirm: 123456 })
    .expect(200)
    .expect('Senha alterada com sucesso!'));
});
