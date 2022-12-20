import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ValidateRegisterTokenMiddleware } from './middleware/valid_token.middleware';
import { ValidateResetPasswordTokenMiddleware } from './middleware/validate_password_token.middleware';
import { LocalStrategy } from './strategy/local.strategy';
import { RegisterStrategy } from './strategy/register.strategy';

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
    ValidateRegisterTokenMiddleware,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateRegisterTokenMiddleware).forRoutes({
      path: 'auth/confirm-register',
      method: RequestMethod.POST,
    });
    consumer.apply(ValidateResetPasswordTokenMiddleware).forRoutes({
      path: 'auth/reset-password',
      method: RequestMethod.POST,
    });
  }
}
