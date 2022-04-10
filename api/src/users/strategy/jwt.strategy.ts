import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private user: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO
      // Change to env variable
      secretOrKey: 'secret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.user.findOne(payload.sub);

    delete user.hash;
    return user;
  }
}
