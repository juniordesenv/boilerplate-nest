import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '~/modules/users/users.service';
import { MailerModule } from '~/config/mailer.module';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockUserModel = {
      create: (data) => ({ ...data, delete: () => {} }),
      delete: () => {},
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('SECRET'),
            signOptions: { expiresIn: '7200s' },
          }),
          inject: [ConfigService],
        }),
        MailerModule,
      ],
      providers: [
        LocalStrategy,
        JwtStrategy,
        ConfigService,
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        AuthService,
      ],
      controllers: [AuthController],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('Login', () => {
    it('should return an token if called login', async () => {
      const result = {
        accessToken: 'any_token',
      };
      jest.spyOn(authService, 'login').mockImplementationOnce(async () => new Promise((resolve) => resolve(result)));

      expect(await authController.login({
        email: 'any@email.com.br',
        password: 'any_password',
      })).toBe(result);
    });
  });

  describe('Registry', () => {
    it('should return success message if createdUser', async () => {
      const result = 'Cadastro efetuado com sucesso!';

      jest.spyOn(authService, 'createUser').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      const user = {
        email: 'any@email.com.br',
        password: 'any_password',
        name: 'Teste',
      };

      const httpResponse = await authController.registry(user);
      expect(httpResponse).toBe(result);
    });


    it('should call createUser with correctValues', async () => {
      const addSpy = jest.spyOn(authService, 'createUser');

      const user = {
        email: 'any@email.com.br',
        password: 'any_password',
        name: 'Teste',
      };

      jest.spyOn(authService, 'sendRegisterEmail').mockImplementationOnce(async () => new Promise((resolve) => resolve(null)));

      await authController.registry(user);
      expect(addSpy).toHaveBeenCalledWith(user);
    });
  });
});
