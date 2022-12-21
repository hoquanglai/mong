import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IUser } from '../auth/interface/user_entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async create(user: CreateUserDto): Promise<ResponseUserDto> {
    const createdUser = await this.knex('user').insert<IUser>(user);
    const { password, ...data } = user;
    return data;
  }

  async findAll() {
    try {
      const users = await this.knex.table('user');
      return { users };
    } catch (err) {
      throw new Error(err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    console.log({ updateUserDto });
    await this.knex('user')
      .update(updateUserDto)
      .where({ email: updateUserDto.email });
    return `update succes`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<IUser> {
    const user = await this.knex
      .select('*')
      .from<IUser>('user')
      .where({ email: email })
      .first();
    if (!user) {
      throw new NotFoundException(
        `User with email: "${email}" does not exists`,
      );
    }

    return user;
  }
}
