/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BullModule } from '@nestjs/bull';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache/cache.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

import { configuration } from './config/configuration';
import { AuthModule } from './modules/auth';
import { ClientModule } from './modules/client/client.module';
import { CommonModule, ExceptionsFilter, LoggerMiddleware } from './modules/common';
import { MessageModule } from './modules/message';
import { TaskModule } from './modules/task';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env['REDIS_HOST'] || 'localhost',
        port: Number(process.env['REDIS_PORT'] || '6379'),
      },
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: `redis://${process.env['REDIS_HOST'] || 'localhost'}:${Number(process.env['REDIS_PORT'] || '6379')}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
        const dbConfig = await config.get('db');
        return {
          ...dbConfig,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    CommonModule,
    ClientModule,
    AuthModule,
    MessageModule,
    TaskModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
