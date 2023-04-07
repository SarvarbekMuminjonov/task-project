import { HttpException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { Login } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Role } from 'src/shared/types/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login(login: Login) {
    const user = await this.knex('users').where({ email: login.email }).first();
    if (!user)
      throw new HttpException('Provider with this email not exists', 404);
    return await this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(Role.USER, createUserDto);
  }
  async generateToken(user) {
    const payload = {
      id: user.id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}
