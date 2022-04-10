import { Controller, Get, Post, Body } from '@nestjs/common';

import { UsersService, AuthService } from './services';
import { CreateUserDto, SigninUserDto } from './dto';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  async signin(@Body() body: SigninUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @Get('user')
  getUsers() {
    return this.usersService.findByEmail('test3@test.com');
  }
}
