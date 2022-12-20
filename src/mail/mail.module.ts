import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          // host: process.env.MAIL_HOST,
          host: 'smtp.gmail.com',

          secure: false,
          auth: {
            // user: process.env.MAIL_USERNAME,
            // pass: process.env.MAIL_PASSWORD,
            user: 'phungthehungc4@gmail.com',
            pass: process.env.MAIL_PW,
          },
        },
        template: {
          dir: `${process.cwd()}/dist/mail/templates/`,
          // dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          option: {
            strict: true,
          },
        },
        defaults: {
          from: 'phungthehungc4@gmail.com',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
