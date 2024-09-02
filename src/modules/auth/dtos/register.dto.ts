/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
