import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({
      select: ['id', 'nombre', 'email', 'password'], 
    });
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password'], 
    });
  }

  create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
