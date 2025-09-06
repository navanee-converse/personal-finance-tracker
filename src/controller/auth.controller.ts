import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto, UserDto } from 'src/dto/user.dto';
import { AuthService } from 'src/service/auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorator/user-data.decorator';
import { JwtPayload } from 'src/dto/jwt-payload.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Public } from 'src/decorator/custom.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth('jwt-token')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 200,
    description:
      'Return sucess message when user registered and set token in header',
  })
  @ApiResponse({
    status: 409,
    description: 'Throw conflict exception when email already exist',
  })
  async register(@Body() userData: UserDto, @Res() res: Response) {
    const userTokenAndResponse = await this.authService.regiser(userData);
    res.setHeader('Authorization', `Bearer ${userTokenAndResponse.token}`);
    res.json(userTokenAndResponse.response);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'Set jwt-token in header after successful login',
  })
  @ApiResponse({
    status: 400,
    description: 'Throw bad request exception when password is wrong',
  })
  async login(@Body() userData: LoginDto, @Res() res: Response) {
    const userTokenAndResponse = await this.authService.login(userData);
    res.setHeader('Authorization', `Bearer ${userTokenAndResponse.token}`);
    res.json(userTokenAndResponse.response);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiResponse({
    status: 200,
    description: 'Get user profile by using jwt-token',
  })
  @ApiResponse({
    status: 401,
    description: 'Throw unauthorized access when jwt-token is invalid',
  })
  async profile(@GetUser() userPayload: JwtPayload) {
    return await this.authService.profile(userPayload);
  }
}
