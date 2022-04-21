import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { PembeliRepository } from './pembeli.repository';
import { createPembeliDto } from '../dto/create-pembeli.dto';
import { query } from 'express';
import { filter } from 'rxjs';
import { Duplex } from 'stream';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly adminRepo: AdminRepository;
  private readonly pembeliRepo: PembeliRepository;

  async getAllUser(): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    return await query.getMany();
  }

  async registerPembeli(
    createUserDto: CreateUserDto,
    createPembeliDto: createPembeliDto,
    role: any,
  ): Promise<void> {
    const { name, password, email, num_phone } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.num_phone = num_phone;
    user.role = role;

    try {
      await user.save();
    } catch (error) {
      if ((error.code = 'ER_DUB_ENTRY')) {
        throw new ConflictException(
          `Email/Number Phone ${email}${num_phone} Alreadey Used`,
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async registerAdmin(
    createUserDto: CreateUserDto,
    role: string,
  ): Promise<void> {
    const { name, password, email, num_phone } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.num_phone = num_phone;
    user.role = role;

    try {
      await user.save();
    } catch (error) {
      if ((error.code = 'ER_DUB_ENTRY')) {
        throw new ConflictException(
          `Email/Number Phone ${email}${num_phone} Alreadey Used`,
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { name, email, password } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code == '23506') {
        throw new ConflictException(`Email ${email} already used`);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
  }

  // async validateUser(email: string, password: string): Promise<User> {
  //   const user = await this.findOne({ email });

  //   if (user && (await user.validatePassword(password))) {
  //     return user;
  //   }
  //   return null;
  // }

  async validateUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const userEmail = await this.findOne({ email });
    const userName = await this.findOne({ name });
    if (userEmail && (await userEmail.validatePassword(password))) {
      return userEmail;
    }
    if (userName && (await userName.validatePassword(password))) {
      return userName;
    }
    return null;
  }
}
