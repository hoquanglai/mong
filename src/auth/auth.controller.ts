import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { SuccessResponse } from '../response/success.response';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Res() res: Response, @Req() req: Request) {
    const tokens = await this.authService.login(req.user);
    return res.json({ ...tokens });
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      // const user = await this.authService.register(dto);
      // return res
      //   .status(201)
      //   .json(new SuccessResponse('Create user successfully', { user }));
      await this.mailService.sendRegisterConfirmation(dto, token);
      return res.status(200).json({
        message: 'Please check your email to confirm your registration',
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
