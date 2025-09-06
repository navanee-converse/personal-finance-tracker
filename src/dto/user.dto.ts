import { IsDefined, IsString } from 'class-validator';

export class UserDto {
  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  full_name: string;
}
