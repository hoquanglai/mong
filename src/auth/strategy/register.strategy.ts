import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RegisterStrategy extends PassportStrategy(
  Strategy,
  'register_strategy',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY_REGISTER,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return 'cc';
  }
}
