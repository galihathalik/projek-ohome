import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { createPembeliDto } from './dto/create-pembeli.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import EmailService from 'src/modules/support/email/email.service';
import process from 'process';
import { udpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.getAllUser();
  }

  async checkVerifiedEmail(email: string) {
    const verified = await this.userRepository.findOne({ where: { email } });

    if (verified.emailVerified) {
      return true;
    } else {
      return false;
    }
  }

  async EmailHasBeenConfirmed(email: string) {
    return this.userRepository.update({ email }, { emailVerified: true });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async RegisterAdmin(
    createUserDto: CreateUserDto,
    role: string,
  ): Promise<void> {
    return await this.userRepository.registerAdmin(createUserDto, role);
  }

  async RegisterPembeli(
    createUserDto: CreateUserDto,
    createPembeli: createPembeliDto,
    role: string,
  ): Promise<void> {
    return await this.userRepository.registerPembeli(
      createUserDto,
      createPembeli,
      role,
    );
  }

  async updateUser(id: string, updateUserDto: udpdateUserDto): Promise<void> {
    const { name, email, password, num_phone } = updateUserDto;
    const user = await this.getUserById(id);
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.num_phone = num_phone;

    await user.save();
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected == 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async validateUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    return await this.userRepository.validateUser(name, email, password);
  }

  sendVerificationLink(email: string) {
    const payload = {
      email: email,
    };

    const token = this.jwtService.sign(payload);

    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;

    const text = `Selamat datang di aplikasi ohome. Untuk verifikasi email anda, klik link berikut: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Verifikasi Email',
      text,
    });
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'koderahasia',
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async confirmEmail(email: string) {
    const user = await this.getByEmail(email);
    if (user.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    } else {
      const confirm = await this.EmailHasBeenConfirmed(email);
      return {
        status: 201,
        message: 'Email confirmation successfully',
      };
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    return await this.userRepository.createUser(createUserDto);
  }

  // async findUser()

  // async validateuser(email: string, password: string): Promise<User> {
  //   return await this.userRepository.validateUser(name, email, password);
  // }

  // async findUserById(id: string): Promise<User> {
  //   return await this.userRepository.findOne(id);
  // }
}
