import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { SuccessResponse } from '../response/success.response';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from './interface/googleLoginData.interface';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { CreateExternalUserDto } from '../user/dto/create-external-user.dto';
import { LoginExternalDto } from './dto/login-external.dto';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login-google')
  async loginGoogle(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    const userId = await this.userService.createThirdParty(user);
    const token = await this.authService.generateToken({
      id: userId,
      email: user?.email,
    });
    return res
      .status(200)
      .json(new SuccessResponse('Login successful0', token));
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Res() res: Response, @Req() req: Request) {
    try {
      const tokens = await this.authService.login(req.user);
      return res.json({ ...tokens });
    } catch (err) {
      throw new BadRequestException('Some thing went wrong');
    }
  }

  @Post('confirm-register')
  // @UseGuards(AuthGuard('register_strategy'))
  async confirmRegister(@Res() res: Response, @Req() req: Request) {
    try {
      await this.userService.update({
        ...req.user,
        verify_token: null,
        isActive: true,
      });
      return res.status(200).json(new SuccessResponse('Register successfully'));
    } catch (err) {
      console.log(err);
    }
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    try {
      const token = await this.authService.generateVerifyToken({
        email: dto.email,
        purpose: process.env.PP_REGISTER,
      });
      dto.verify_token = token;
      await this.mailService.sendRegisterConfirmation(dto, token);
      await this.authService.register(dto);
      return res
        .status(200)
        .json(
          new SuccessResponse(
            'Please check your email to confirm your registration',
          ),
        );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @Res() res: Response) {
    await this.authService.changePassword(dto);
    return res.status(200).json(new SuccessResponse('update successfully'));
  }

  @Post('send-mail-reset-password')
  async sendMailResetPassword(
    @Body() { email }: { email: string },
    @Res() res: Response,
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not exists`);
    }
    const token = await this.authService.generateVerifyToken({
      email,
      purpose: process.env.PP_RESET_PASSWORD,
    });
    user.password_token = token;
    await this.userService.update(user);
    await this.mailService.sendResetPassword(email, token);
    return res
      .status(200)
      .json(new SuccessResponse('Email reset password is sent to your email'));
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    const payload = hashedPassword;
    await this.userService.update({
      email: req?.body?.email,
      password: payload,
    });
    return res
      .status(200)
      .json(new SuccessResponse('Change password successfully'));
  }
}
