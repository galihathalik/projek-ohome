import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { get } from 'http';
import { User } from 'src/entities/user.entity';
import { UUIDValidationPipe } from 'src/modules/support/pipe/uuid-validation.pipe';
import { GetUser } from '../auth/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { createPembeliDto } from './dto/create-pembeli.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { udpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { TokenDto } from './dto/token.dto';
import { Role } from 'src/entities/roles.enum';
import { title } from 'process';
import RoleGuard from '../auth/guard/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<void> {
    return this.userService.createUser(payload);
  }

  @Get()
  getAllUser(@GetUser() user: User) {
    return this.userService;
  }

  @Get('/:id')
  async getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('register-admin')
  @UseGuards(JwtGuard)
  @UseGuards(RoleGuard(Role.Admin))
  async RegisterAdmin(@Body() payload: CreateUserDto): Promise<void> {
    let role = 'Admin';
    return this.userService.RegisterAdmin(payload, role);
  }

  @Post('register-pembeli')
  async RegisterPembeli(
    @Body() createUser: CreateUserDto,
    @Body() createPembeli: createPembeliDto,
  ): Promise<void> {
    let role = 'Pembeli';
    const user = this.userService.RegisterPembeli(
      createUser,
      createPembeli,
      role,
    );
    await this.userService.sendVerificationLink(createUser.email);
    //send verification
    return user;
  }

  @Put('update-pembeli/:id')
  @UseGuards(JwtGuard)
  async updatePembeli(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: udpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(id, payload);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Post('confirm')
  async confirmEmail(@Query() confirmationData: TokenDto) {
    const email = await this.userService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.userService.confirmEmail(email);
  }
}
