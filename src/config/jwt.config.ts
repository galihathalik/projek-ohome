import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'kode rahasia',
  signOptions: {
    expiresIn: 100,
  },
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 3600 * 24,
};
