import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';
import { RegisterStrategy } from './strategy/register.strategy';
import { ValidateTokenMiddleware } from './middleware/valid_token.middleware';
import { ValidateResetPasswordTokenMiddleware } from './middleware/validate_password_token.middleware';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    RegisterStrategy,
    JwtService,
    UserService,
    MailService,
    ValidateTokenMiddleware,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTokenMiddleware).forRoutes({
      path: 'auth/confirm',
      method: RequestMethod.POST,
    });
    consumer.apply(ValidateResetPasswordTokenMiddleware).forRoutes({
      path: 'auth/reset-password',
      method: RequestMethod.POST,
    });
  }
}
