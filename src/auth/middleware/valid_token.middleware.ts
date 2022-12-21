import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../user/user.service';
import { VerifyPurpose } from '../interface/register_purpose.enum';

@Injectable()
export class ValidateRegisterTokenMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenFromRequest = req.body?.token;
      if (!tokenFromRequest) {
        throw new BadRequestException('Token is empty');
      }
      const dataFromToken = this.jwtService.verify(tokenFromRequest, {
        secret: process.env.SECRET_KEY_VERIFY,
      });
      if (dataFromToken.purpose !== VerifyPurpose.REGISTER) {
        throw new BadRequestException('This token is not for confirm register');
      }

      const user = await this.userService.findOneByEmail(dataFromToken.email);
      console.log({ dataFromToken });

      const isValidToken = user.verify_token === tokenFromRequest;
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
