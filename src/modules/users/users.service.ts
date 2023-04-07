import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/shared/types/enums';
import { Pagination } from 'src/shared/utils/pagination';

@Injectable()
export class UsersService {
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async create(role: Role, createUserDto: CreateUserDto) {
    if (role !== Role.ADMIN) createUserDto.role = Role.USER;
    const user = await this.knex('users')
      .where({
        email: createUserDto.email,
      })
      .first();
    if (user) throw new ConflictException('This email is already exists');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    return await this.knex('users')
      .insert({
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      })
      .returning(['id', 'firstname', 'lastname', 'email', 'role']);
  }

  async findAll(pagination: Pagination) {
    const count = await this.knex('users').where({ role: Role.USER }).count();
    const total_count = +count[0].count;
    const page_count = Math.ceil(total_count / pagination.limit);
    const previous_page = +pagination.current_page;
    const offset = (previous_page - 1) * pagination.limit;
    const current_page =
      pagination.offset > 0
        ? Math.ceil(pagination.offset / pagination.limit)
        : 1;
    console.log(offset);
    const result = await this.knex('users')
      .where({ role: Role.USER })
      .offset(offset)
      .limit(pagination.limit);
    return {
      result,
      pageInfo: {
        total_count,
        previous_page,
        current_page,
        page_count,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.knex('users')
      .where({ id: id, role: Role.USER })
      .select('id', 'firstname', 'lastname', 'email')
      .first();
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.knex('users')
      .update(updateUserDto)
      .where({ id: id })
      .returning(['id', 'firstname', 'lastname', 'email']);
  }

  async remove(id: number) {
    return await this.knex('users')
      .del()
      .where({ id: id, role: Role.USER })
      .returning(['id', 'firstname', 'lastname', 'email'])
      .first();
  }
}
