import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return process.env.SECRET_KEY_ACCESS_TOKEN;
  }
}
