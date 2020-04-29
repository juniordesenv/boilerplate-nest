/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { defaultBeforeAll } from './init';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let user;

  beforeAll(async () => {
    const result = await defaultBeforeAll();
    app = result.app;
    user = result.user;
  });

  it('/auth/signup (POST)', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({ name: 'Test name', email: 'jr.miranda@outlook.com', password: '123456' })
    .expect(201)
    .expect('Cadastro efetuado com sucesso!'));

  it('/auth/signup (POST)', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({ email: 'jr.miranda@outlook.com', password: '123456' })
    .expect(422));

  it('/auth/signup (POST)', () => request(app.getHttpServer())
    .post('/auth/signup')
    .send({ name: 'Test name', email: 'test@test.com', password: '123456' })
    .expect(400)
    .expect({ status: 400, error: 'Email já cadastrado!' }));

  it('/auth/signup/confirm/:token (PUT) and LOGIN', () => request(app.getHttpServer())
    .put(`/auth/signup/confirm/${user.confirmToken}`)
    .expect(200)
    .expect('Email confirmado com sucesso!'));
});
