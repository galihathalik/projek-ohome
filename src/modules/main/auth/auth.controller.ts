import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/modules/main/auth/guard/jwt.guard';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDTO } from './dto/refresh-access-token.dto';
import { GetUser } from '../auth/get-user.decorator';
import { LoginResponse } from './interface/login-responsive.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-admin')
  async loginAdmin(@Body() LoginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.loginAdmin(LoginDto);
  }

  @Post('login-pembeli')
  async loginPembeli(@Body() LoginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.loginPembeli(LoginDto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: refreshAccessTokenDTO,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Patch('/:id/revoke')
  @UseGuards(JwtGuard)
  async revokeRefreshToken(@Param('id') id: string): Promise<void> {
    return this.authService.revokeRefreshToken(id);
  }
}
