import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/shared/types/enums';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Firstname of user' })
  @IsString()
  firstname: string;

  @ApiProperty({ type: String, description: 'Lastname of user' })
  @IsString()
  lastname: string;

  @ApiProperty({ type: String, description: 'Email of user' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Password of user' })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role = Role.USER;
}
