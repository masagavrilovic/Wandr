import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService, Tokens } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UsersService } from '../user/user.service';
import { ACCESS_MAX_AGE_MS, REFRESH_MAX_AGE_MS } from './auth.constants';

type AuthRequest = Request & {
  user: { id: number; email: string; refreshToken?: string };
};

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.register(dto);
    this.setAuthCookies(res, tokens);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);
    this.setAuthCookies(res, tokens);
    return { message: 'Logged in' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refresh(req.user.id, req.user.refreshToken!);
    this.setAuthCookies(res, tokens);
    return { message: 'Tokens refreshed' };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (refreshToken) await this.authService.logout(refreshToken);
    this.clearAuthCookies(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthRequest) {
    return this.usersService.findOne(req.user.id);
  }

  private get cookieBase() {
    return {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
    };
  }

  private setAuthCookies(res: Response, tokens: Tokens) {
    res.cookie('access_token', tokens.accessToken, {
      ...this.cookieBase,
      path: '/',
      maxAge: ACCESS_MAX_AGE_MS,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      ...this.cookieBase,
      path: '/auth',
      maxAge: REFRESH_MAX_AGE_MS,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('access_token', { ...this.cookieBase, path: '/' });
    res.clearCookie('refresh_token', { ...this.cookieBase, path: '/auth' });
  }
}