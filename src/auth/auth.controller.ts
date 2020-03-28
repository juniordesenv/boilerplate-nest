import {
  Controller, Request, Get, Post, UseGuards, Body, HttpException, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '~/dto/users/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/registry')
  async registry(@Body() createUserDto: CreateUserDto) {
    try {
      await this.authService.createUser(createUserDto);
      return 'Cadastro efetuado com sucesso!';
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
