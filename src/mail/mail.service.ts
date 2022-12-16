import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseUserDto } from '../user/dto/response-user.dto';
// var nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRegisterConfirmation(user: ResponseUserDto, token: string) {
    try {
      const url = `http://localhost:3000.com/auth/confirm?token=${token}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './confirmation',
        context: {
          name: user.name,
          url,
        },
      });
    } catch (err) {
      console.log('eeeeeeeeeeee', err);
    }
  }
  // sendMail() {
  //   var transporter = nodemailer.createTransport({
  //     // config mail server
  //     service: 'Gmail',
  //     auth: {
  //       user: 'mailserver@gmail.com',
  //       pass: 'password',
  //     },
  //   });
  // }
}
