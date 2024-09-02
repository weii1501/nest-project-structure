import { Controller, Post, Body, UseGuards, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UtilService } from 'src/modules/common';
import { JwtAuthenticationGuard, Payload } from 'src/modules/common/authentication';

import { NormalResponse } from '../../share';
import { LoginDto, RegisterDto } from '../dtos';
import { AuthService } from '../services';
import { AuthUser } from 'src/modules/share/auth/auth-user.decorator';
import { UserPayload } from 'src/modules/share/auth/auth.interface';

/**
 * https://docs.nestjs.com/techniques/authentication
 */

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private util: UtilService) {}

  /**
   * See test/e2e/jwt-authentication.spec.ts
   */
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<NormalResponse> {
    return this.auth.login(loginDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('check')
  public check(@Body() user: Payload): NormalResponse {
    return this.auth.jwtCheck(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  public async register(@Body() registerDto: RegisterDto): Promise<NormalResponse> {
    return this.auth.register(registerDto);
  }

  @Get('check-auth')
  @UseGuards(JwtAuthenticationGuard)
  getProfile(@AuthUser() user: UserPayload) {
    // Access the user data extracted from the JWT
    console.log('user', user);
    return true;
  }
}
