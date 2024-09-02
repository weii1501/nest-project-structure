/* eslint-disable no-console */
import { ValidationPipe, BadGatewayException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationError } from 'class-validator';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './modules/common';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: isProduction
      ? WinstonModule.createLogger({
          level: 'info',
          format: winston.format.json(),
          transports: [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/query.log',
              level: 'query',
            }),
            new winston.transports.File({
              filename: 'logs/info.log',
              level: 'info',
            }),
            new winston.transports.Console({
              format: winston.format.combine(winston.format.colorize(), winston.format.json()),
            }),
          ],
        })
      : undefined,
  });

  // Apply the global exception filter
  app.useGlobalFilters(new ExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true, // transform object to DTO class
      exceptionFactory: (validationErrors: ValidationError[] = []) => new BadGatewayException(validationErrors),
    }),
  );
  app.setGlobalPrefix(`api/v${process.env['VERSON'] || '1'}`);
  if (isProduction) {
    app.enable('trust proxy');
  }

  middleware(app);
  await app.listen(process.env.PORT || 3001);
}

console.log('PORT ENV ', process.env.PORT);

bootstrap()
  .then(() => console.log(`Bootstrap on port ${process.env.PORT || 3000}`, new Date().toLocaleString()))
  .catch(console.error);
