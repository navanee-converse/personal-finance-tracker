import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  email: string;
}

export class UserDto extends LoginDto {
  @IsDefined()
  @IsString()
  full_name: string;
}
