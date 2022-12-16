import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';
import { RolesGuard } from './auth/role/roles.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';

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
export class AppModule {}
