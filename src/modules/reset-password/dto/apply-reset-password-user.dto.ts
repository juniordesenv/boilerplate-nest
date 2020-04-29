import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '~/validation/is-equal-to';

export class ApplyResetPasswordUserDto {
  token?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirm: string;
}
