import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/modules/main/users/users.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDTO } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-responsive.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async loginAdmin(LoginDto: LoginDto): Promise<LoginResponse> {
    const { name, email, password } = LoginDto;

    const user = await this.userService.validateUser(name, email, password);
    if (!user) {
      throw new UnauthorizedException(
        'username atau email atau password salah',
      );
    }
    if (user.role != `Admin`) {
      throw new UnauthorizedException('anda tidak memiliki akses');
    }

    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);
    const bisa = `berhasil login sebagai admin`;
    return { access_token, refresh_token, bisa } as LoginResponse;
  }

  async loginPembeli(LoginDto: LoginDto): Promise<LoginResponse> {
    const { name, email, password } = LoginDto;

    const user = await this.userService.validateUser(name, email, password);
    if (!user) {
      throw new UnauthorizedException(
        'Username atau email atau password Salah',
      );
    }
    if (user.role != `Pembeli`) {
      throw new UnauthorizedException('anda tidak memiliki akses');
    }
    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);
    const berhasil = `berhasil login sebagai pembeli`;
    return { access_token, refresh_token, berhasil } as LoginResponse;
  }

  // async login(LoginDto: LoginDto): Promise<LoginResponse> {
  //   const { email, password } = LoginDto;

  //   const user = await this.userService.validateuser(email, password);
  //   if (!user) {
  //     throw new UnauthorizedException('Wrong email or Password');
  //   }

  //   const access_token = await this.createAccessToken(user);
  //   const refresh_token = await this.createRefreshToken(user);

  //   return { access_token, refresh_token } as LoginResponse;
  // }

  async refreshAccessToken(
    refreshTokenDto: refreshAccessTokenDTO,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;

    const payload = await this.decodeToken(refresh_token);

    const refreshToken = await this.refreshTokenRepository.findOne(
      payload.jid,
      { relations: ['user'] },
    );

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token is not found');
    }
    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refersh token has been revoked ');
    }

    const access_token = await this.createAccessToken(refreshToken.user);

    return { access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is Expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.refreshTokenRepository.createRefreshToken(
      user,
      +refreshTokenConfig.expiresIn,
    );

    const payload = {
      jid: refreshToken.id,
    };
    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );
    return refresh_token;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne(id);
    if (!refreshToken) {
      throw new NotFoundException('Refresh token is not found');
    }
    refreshToken.isRevoked = true;
    await refreshToken.save();
  }
}
