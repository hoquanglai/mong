import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/user_roles.enum';
import { Request, Response } from 'express';
import { SuccessResponse } from '../response/success.response';
import { MyProfileDto } from './dto/myProfileDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.userService.create(createUserDto);
      return res
        .status(201)
        .json(new SuccessResponse('Create User Successfully'));
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }
  @Get()
  @Roles(Role.USER)
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  @Get('my-profile')
  @Roles(Role.USER)
  myProfile(@Req() req: any, @Res() res: Response) {
    try {
      const entityToDto = new MyProfileDto(req.user);
      return res.status(200).send(entityToDto);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }
}
