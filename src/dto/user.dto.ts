import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'abc_123' })
  password: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
}

export class UserDto extends LoginDto {
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'John' })
  full_name: string;
}
