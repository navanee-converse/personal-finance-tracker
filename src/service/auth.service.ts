import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, UserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}
  async regiser(userData: UserDto) {
    try {
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
      const hashedPassword = await bcrypt.hash(
        userData.password,
        Number(process.env.SALTROUND) || 5,
      );
      const user: User = await this.userRepo.save({
        ...userData,
        password: hashedPassword,
      });
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
    } catch (error) {
      throw error;
    }
  }

  async login(userData: LoginDto) {
    const isUser = await this.userRepo.findOne({
      where: { email: userData.email },
    });
    if (!isUser) {
      throw new NotFoundException({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        error: 'User mail not found',
      });
    }
    const isValidPassword = await bcrypt.compare(
      userData.password,
      isUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException({
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Invalid password',
      });
    }
    const payload = {
      id: isUser.id,
      name: isUser.full_name,
      email: isUser.email,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      response: {
        success: true,
        statusCOde: HttpStatus.OK,
        message: 'Login Successfull',
      },
    };
  }
}
