/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from './auth.interface';

@Injectable()
export class AuthUserDecorator {
  public getUser(context: ExecutionContext): UserPayload {
    const request = context.switchToHttp().getRequest();
    return request?.user;
  }
}

export const AuthUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const authUserDecorator = new AuthUserDecorator();
  return authUserDecorator.getUser(context);
});
