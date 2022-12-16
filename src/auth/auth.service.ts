import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { tokenData } from '../../dist/auth/interface/auth.interface';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateToken(payload: tokenData) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
        expiresIn: 60 * 60 * 24 * 15,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY_REFRESH_TOKEN,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async register(user: CreateUserDto): Promise<ResponseUserDto> {
    const hashPassword = await this.hashData(user.password);
    user.password = hashPassword;
    const userReturn = await this.userService.create(user);
    return userReturn;
  }

  validateUser = async (email: string, password: string) => {
    const user = await this.userService.findOneByEmail(email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('User is invalid');
    }
    return user;
  };
  async login(user: any) {
    const payload: tokenData = { userEmail: user.email, sub: user.id };
    return this.generateToken(payload);
  }
}
