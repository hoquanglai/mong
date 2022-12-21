import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class ValidateResetPasswordTokenMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenFromRequest = req.body?.token;

      if (!tokenFromRequest) {
        throw new BadRequestException('Token is empty');
      }

      const dataFromToken = this.jwtService.verify(tokenFromRequest, {
        secret: process.env.SECRET_KEY_RESET_PASSWORD,
      });

      const user = await this.userService.findOneByEmail(dataFromToken.email);

      const isValidToken = user.password_token === tokenFromRequest;
      if (!isValidToken) {
        throw new NotFoundException('invalid token');
      }

      req.user = user;
      req.body = { ...req.body, ...user };
      next();
    } catch (err) {
      console.log('Error when validate reset password token', err);
      if (err.message === 'invalid signature') {
        throw new NotFoundException('invalid token');
      }
      next(err);
    }
  }
}
