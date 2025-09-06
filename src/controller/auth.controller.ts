import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from 'src/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}
  @Post()
  async register(@Body() userData: UserDto) {
    const userTokenAndResponse = await this.authService.regiser(userData);
    resizeBy.s
  }
}
