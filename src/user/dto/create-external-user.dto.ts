import { IsString } from 'class-validator';

export class CreateExternalUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;
}
