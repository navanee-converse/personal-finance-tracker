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
import { JwtPayload } from 'src/dto/jwt-payload.dto';
import { APIResponse } from 'src/dto/response.dto';

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
        throw new ConflictException(
          'User with this email is already registered',
        );
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
      const response: APIResponse<unknown> = {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Registration Completed',
      };
      return {
        token,
        response,
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
      throw new NotFoundException('User mail not found');
    }
    const isValidPassword = await bcrypt.compare(
      userData.password,
      isUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }
    const payload = {
      id: isUser.id,
      name: isUser.full_name,
      email: isUser.email,
    };
    const token = await this.jwtService.signAsync(payload);
    const response: APIResponse<unknown> = {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Login Successfull',
    };

    return {
      token,
      response,
    };
  }

  async profile(userPayload: JwtPayload): Promise<APIResponse<Partial<User>>> {
    const user = await this.userRepo.findOne({ where: { id: userPayload.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userPayloads = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    };
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: userPayloads,
    };
  }
}
