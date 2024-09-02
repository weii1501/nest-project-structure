/* eslint-disable @typescript-eslint/typedef */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { UtilService } from 'src/modules/common';
import { AuthenticationService, Payload } from 'src/modules/common/authentication';
import { Repository } from 'typeorm';

import { NormalResponse } from '../../share';
import { LoginDto, RegisterDto } from '../dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private util: UtilService,
    private authenticationService: AuthenticationService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * See test/e2e/jwt-authentication.spec.ts
   */
  public async login(loginDto: LoginDto): Promise<NormalResponse> {
    const check = await this.authenticationService.validateUser(loginDto.email, loginDto.password);
    if (!check) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    // eslint-disable-next-line @typescript-eslint/typedef
    const roleslist = check.roles;
    const user = {
      userId: check.id,
      username: check.name,
      roles: roleslist,
    };
    return this.util.buildSuccessResponse(this.authenticationService.jwtSign(user));
  }

  public jwtCheck(user: Payload): NormalResponse {
    return this.util.buildSuccessResponse(user);
  }

  public async register(register: RegisterDto): Promise<NormalResponse> {
    const checkExistUser = await this.authenticationService.checkExistEmail(register.email);

    if (checkExistUser) {
      throw new HttpException('Email already exists', 400);
    }

    const user = new User({
      name: register.name,
      email: register.email,
      password: await this.util.hash(register.password),
      roles: [],
    });
    // user.name = register.name;
    // user.email = register.email;
    // user.password = await this.util.hash(register.password);
    // user.roles = [];
    await this.userRepository.save(user);

    return this.util.buildSuccessResponse(user);
  }

  public async checkAuth() {
    return this.util.buildSuccessResponse('Auth is working');
  }


  // @Cron('* * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}
