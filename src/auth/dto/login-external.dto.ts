import { IsNotEmpty, IsString } from 'class-validator';

export class LoginExternalDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
