import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}
  async regiser(userData: UserDto) {
    const isPresent = await this.userRepo.findOne({
      where: { email: userData.email },
    });
    if (isPresent) {
      throw new ConflictException({
        success: false,
        statusCode: 409,
        error: 'User with this email is already registered',
      });
    }
    userData.password = await bcrypt.hash(
      userData.password,
      process.env.SALTROUND || 5,
    );
    const user: User = await this.userRepo.save(userData);
    const payload = { id: user.id, name: user.full_name, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      response: {
        success: true,
        statusCOde: HttpStatus.CREATED,
        message: 'Registration Completed',
      },
    };
  }
}
