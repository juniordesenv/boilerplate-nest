/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { defaultBeforeAll } from './init';
import { ResetPassword } from '../src/modules/reset-password/model/reset.password.model';

describe('ResetPasswordController (e2e)', () => {
  let app: INestApplication;

  let resetPasswordsCollection: ReturnModelType<typeof ResetPassword>;

  let resetPasswordDefault: ResetPassword;

  beforeAll(async () => {
    const result = await defaultBeforeAll();
    app = result.app;
    const { user } = result;

    resetPasswordsCollection = app.get(getModelToken('ResetPassword'));

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
