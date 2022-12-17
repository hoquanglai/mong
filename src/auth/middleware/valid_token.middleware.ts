import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeee');
      const tokenFromRequest = req.body?.token;
      if (!tokenFromRequest) {
        throw new BadRequestException('Token is empty');
      }
      const dataFromToken = this.jwtService.verify(tokenFromRequest, {
        secret: process.env.SECRET_KEY_REGISTER,
      });
      const user = await this.userService.findOneByEmail(dataFromToken.email);
      console.log(user);

      const isValidToken = user.register_token === tokenFromRequest;
      if (!isValidToken) {
        throw new NotFoundException('invalid token');
      }
      req.user = user;
      next();
    } catch (err) {
      if (err.message === 'invalid signature') {
        throw new NotFoundException('invalid token');
      }
      next(err);
    }
  }
}
