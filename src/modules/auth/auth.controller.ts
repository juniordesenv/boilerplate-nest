import {
  Controller, Request, Get, Post, UseGuards, Body, HttpException, HttpStatus, Put, Param,
} from '@nestjs/common';
import {
  ApiTags, ApiResponse, ApiBearerAuth, ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cadastro efetuado com sucesso!' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('auth/signup')
  @ApiResponse({ status: 201, description: 'Cadastro efetuado com sucesso!' })
  @ApiResponse({ status: 400, description: 'Email já cadastrado!' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      await this.authService.createUser(createUserDto);
      return 'Cadastro efetuado com sucesso!';
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Email já cadastrado!',
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('auth/signup/confirm/:token')
  @ApiResponse({ status: 200, description: 'Email confirmado com sucesso!' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async confirmEmail(@Param('token') token: string) {
    try {
      await this.authService.confirmEmailUser(token);
      return 'Email confirmado com sucesso!';
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
