import {
  Injectable,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyTokenData } from './interface/verifyToken.interface';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateToken(payload: any) {
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

  async generateVerifyToken({ email, purpose }: VerifyTokenData) {
    const token = await this.jwtService.signAsync(
      { email, purpose },
      {
        secret: process.env.SECRET_KEY_VERIFY,
        expiresIn: 60 * 60 * 5,
      },
    );
    return token;
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
    console.log({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(
        `Email "${email}" or password is not valid`,
      );
    }
    return user;
  };

  async login(user: any) {
    const payload = { userEmail: user.email, sub: user.id };
    return this.generateToken(payload);
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new NotFoundException(
        `User with email "${dto.email}" does not exist`,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    user.password = hashedPassword;
    user.verify_token = null;

    await this.userService.update(user);
  }
}
