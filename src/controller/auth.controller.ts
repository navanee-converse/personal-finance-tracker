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

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() userData: UserDto, @Res() res: Response) {
    const userTokenAndResponse = await this.authService.regiser(userData);
    res.setHeader('Authorization', `Bearer ${userTokenAndResponse.token}`);
    res.json(userTokenAndResponse.response);
  }

  @Public()
  @Post('login')
  async login(@Body() userData: LoginDto, @Res() res: Response) {
    const userTokenAndResponse = await this.authService.login(userData);
    res.setHeader('Authorization', `Bearer ${userTokenAndResponse.token}`);
    res.json(userTokenAndResponse.response);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@GetUser() userPayload: JwtPayload) {
    return await this.authService.profile(userPayload);
  }
}
