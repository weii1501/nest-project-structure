/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
