import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env.prod'],
    }),
    S3Module,
    // KnexModule.forRoot({
    //   config: {
    //     client: 'mysql',
    //     connection: {
    //       host: process.env.DB_HOST,
    //       user: process.env.DB_USER,
    //       password: process.env.DB_PWD,
    //       database: process.env.DB_NAME,
    //     },
    //   },
    // }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
