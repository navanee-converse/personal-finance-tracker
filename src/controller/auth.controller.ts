import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from 'src/service/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}
  @Post('register')
  async register(@Body() userData: UserDto, @Res() res: Response) {
    const userTokenAndResponse = await this.authService.regiser(userData);
    res.setHeader('Authorization', `Bearer ${userTokenAndResponse.token}`);
    res.json(userTokenAndResponse.response);
    return userTokenAndResponse;
  }
}
