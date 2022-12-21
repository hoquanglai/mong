import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './auth/auth.module';
import { FireBaseAuthMiddleware } from './auth/middleware/firebase_auth.middleware';
import { RolesGuard } from './auth/role/roles.guard';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payment/payment.module';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env.prod'],
    }),

    S3Module,

    PaymentModule,

    UserModule,

    AuthModule,
    // KnexModule.forRoot({
    //   config: {
    //     client: 'c',
    //     connection: {
    //       host: process.env.DB_HOST,
    //       user: process.env.DB_USER,
    //       password: process.env.DB_PWD,
    //       database: process.env.DB_NAME,
    //     },
    //   },
    // }),

    KnexModule.forRoot({
      config: {
        client: 'mysql',
        useNullAsDefault: true,
        connection: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PWD,
          database: process.env.DB_NAME,
        },
      },
    }),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FireBaseAuthMiddleware).forRoutes({
      path: 'auth/login-google',
      method: RequestMethod.POST,
    });
  }
}
