import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from './match.decorator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('newPassword')
  passwordConfirm: string;
}
