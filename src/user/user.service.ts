import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Role } from 'src/auth/role/user_roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../dist/auth/interface/user_interface';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async create(user: CreateUserDto): Promise<ResponseUserDto> {
    const createdUser = await this.knex('user').insert<User>(user);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<any> {
    try {
      const user = await this.knex
        .select('id', 'email', 'name', 'password', 'role')
        .from<User>('user')
        .where({ email: email })
        .first();
      console.log(user);

      if (!user) {
        throw new NotFoundException(
          `User with email: "${email}" does not exists`,
        );
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
