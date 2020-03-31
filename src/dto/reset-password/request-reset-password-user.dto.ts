import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestResetPasswordUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
