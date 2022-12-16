import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtService,
    UserService,
    MailService,
  ],
})
export class AuthModule {}
