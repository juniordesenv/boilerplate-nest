import {
  Controller, Post, Body, HttpException, HttpStatus, Put, Param,
} from '@nestjs/common';
import {
  ApiTags, ApiResponse,
} from '@nestjs/swagger';
import { RequestResetPasswordUserDto } from '~/modules/reset-password/dto/request-reset-password-user.dto';
import { ApplyResetPasswordUserDto } from '~/modules/reset-password/dto/apply-reset-password-user.dto';
import { ResetPasswordService } from './reset-password.service';

@ApiTags('Auth')
@Controller('auth/reset-password')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
  ) { }

  @Post()
  @ApiResponse({ status: 200, description: 'Solicitação efetuada com sucesso, verefique seu email!' })
  @ApiResponse({ status: 500, description: 'Erro inesperado' })
  async create(@Body() requestResetPasswordUserDto: RequestResetPasswordUserDto) {
    try {
      await this.resetPasswordService.create(requestResetPasswordUserDto);
      return 'Solicitação efetuada com sucesso, verefique seu email!';
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':token')
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso!' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Solicitação expirada ou inválida' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Erro inesperado' })
  async update(@Param('token') token: string, @Body() applyResetPasswordUserDto: ApplyResetPasswordUserDto) {
    try {
      await this.resetPasswordService.updateByToken({
        ...applyResetPasswordUserDto,
        token,
      });
      return 'Senha alterada com sucesso!';
    } catch (err) {
      if (err.message === 'ExpiredOrNotFound') {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Solicitação expirada ou inválida',
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro inesperado',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
