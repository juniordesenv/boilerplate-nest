/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { defaultBeforeAll } from './init';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const result = await defaultBeforeAll();
    app = result.app;
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
