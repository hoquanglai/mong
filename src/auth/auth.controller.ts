import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { MailService } from '../mail/mail.service';
import { SuccessResponse } from '../response/success.response';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyPurpose } from './interface/register_purpose.enum';

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
    return res.status(200).json(new SuccessResponse('Login successful', token));
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Res() res: Response, @Req() req: Request) {
    try {
      const tokens = await this.authService.login(req.user);
      return res.status(200).json({ ...tokens });
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
        purpose: VerifyPurpose.REGISTER,
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
      purpose: VerifyPurpose.RESET_PASSWORDS,
    });
    user.verify_token = token;
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
