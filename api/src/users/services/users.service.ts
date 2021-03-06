import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}

  create(email: string, hash: string) {
    const user = this.user.create({ email, hash });

    return this.user.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.user.findOne(id);
  }

  findByEmail(email: string) {
    return this.user.find({ email });
  }
}
