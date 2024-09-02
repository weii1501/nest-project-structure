import { HttpException } from '@nestjs/common';

export const ACCOUNT_NOT_FOUND = new HttpException('Account not found.', 1);
export const EXISTED_ACCOUNT = new HttpException('Account existed.', 2);
