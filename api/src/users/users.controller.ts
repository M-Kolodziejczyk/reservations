import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './services';
import { CreateUserDto, SigninUserDto } from './dto';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signin(@Body() body: SigninUserDto) {
    return this.authService.signin(body.email, body.password);
  }
}
