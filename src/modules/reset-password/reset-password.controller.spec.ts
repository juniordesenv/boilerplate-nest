import { Test } from '@nestjs/testing';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { UsersService } from '~/modules/users/users.service';
import { MailerModule } from '~/config/mailer.module';

describe('ResetPasswordController', () => {
  let resetPasswordController: ResetPasswordController;
  let resetPasswordService: ResetPasswordService;

  beforeEach(async () => {
    const mockModel = {
      create: (data) => ({ ...data, delete: () => {} }),
      delete: () => {},
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MailerModule,
      ],
      providers: [
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('ResetPassword'),
          useValue: mockModel,
        },
        ResetPasswordService,
        UsersService,
      ],
      controllers: [ResetPasswordController],
    }).compile();

    resetPasswordService = moduleRef.get<ResetPasswordService>(ResetPasswordService);
    resetPasswordController = moduleRef.get<ResetPasswordController>(ResetPasswordController);
  });

  describe('Create ResetPassword', () => {
    it('should return success message if created reset password', async () => {
      const result = 'Solicitação efetuada com sucesso, verefique seu email!';

      jest.spyOn(resetPasswordService, 'create').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      const user = {
        email: 'any@email.com.br',
      };

      const httpResponse = await resetPasswordController.create(user);
      expect(httpResponse).toBe(result);
    });


    it('should call create with correct values', async () => {
      const addSpy = jest.spyOn(resetPasswordService, 'create');

      const user = {
        email: 'any@email.com.br',
      };

      jest.spyOn(resetPasswordService, 'create').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      await resetPasswordController.create(user);
      expect(addSpy).toHaveBeenCalledWith(user);
    });
  });


  describe('UpdateByToken ResetPassword', () => {
    it('should return success message if updated password user', async () => {
      const result = 'Senha alterada com sucesso!';

      jest.spyOn(resetPasswordService, 'updateByToken').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      const resetPassword = {
        password: '123456',
        passwordConfirm: '123456',
      };

      const httpResponse = await resetPasswordController.update('any_token', resetPassword);
      expect(httpResponse).toBe(result);
    });


    it('should call update token with correct values', async () => {
      const addSpy = jest.spyOn(resetPasswordService, 'updateByToken');

      const resetPassword = {
        token: 'any_token',
        password: '123456',
        passwordConfirm: '123456',
      };

      jest.spyOn(resetPasswordService, 'updateByToken').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      await resetPasswordController.update(resetPassword.token, resetPassword);
      expect(addSpy).toHaveBeenCalledWith(resetPassword);
    });
  });
});
