import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { JwtPayload } from './jwt-payload.interface';
import { ACCESS_TTL, REFRESH_TTL } from './auth.constants';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UsersService } from '../user/user.service';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateAndStoreTokens(user.id, user.email);
    return { user, tokens };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _pw, ...result } = user;
    return result;
  }

  async login(user: { id: number; email: string }): Promise<Tokens> {
    return this.generateAndStoreTokens(user.id, user.email);
  }

  async refresh(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Access denied');

    if (user.refreshTokenHash !== this.hashToken(refreshToken)) {
      throw new UnauthorizedException('Access denied');
    }

    return this.generateAndStoreTokens(user.id, user.email);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
      if (user?.refreshTokenHash === this.hashToken(refreshToken)) {
        await this.usersService.setRefreshTokenHash(payload.sub, null);
      }
    } 
    catch {}
  }

  private async generateAndStoreTokens(userId: number, email: string): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: ACCESS_TTL,
      }),
      this.jwtService.signAsync(
        { ...payload, jti: randomUUID() },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: REFRESH_TTL,
        },
      ),
    ]);

    await this.usersService.setRefreshTokenHash(userId, this.hashToken(refreshToken));
    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}