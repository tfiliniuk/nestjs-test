import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bycript from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();

    const salt = await bycript.genSalt();
    user.password = await bycript.hash(userDTO.password, salt);

    const savedUser = await this.userRepo.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Coul not find user');
    }

    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Coul not find user');
    }

    return user;
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepo.update(
      {
        id: userId,
      },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepo.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepo.findOneBy({ apiKey });
  }
}
