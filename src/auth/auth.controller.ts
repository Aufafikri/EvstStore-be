import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { MailService } from 'src/mail/mail.service';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInterceptor } from './interceptor/login-user.interceptor';
import { GithubAuthGuard } from './guards/github.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) {}

  @Get('/verify-email')
  public async verifyEmail(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.verifyEmail(token);
      return res.redirect('http://localhost:3000/verification');
    } catch (error) {
      return res.status(400).send('Invalid or expired token');
    }
  }

  @Get('reset-password')
  public async getResetPassword(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.validateResetToken(token);
      return res.redirect(
        `http://localhost:3000/reset-password?token=${token}`,
      );
    } catch (error) {
      return res.status(400).send('Invalid or expired token GUYS');
    }
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  public async loginWithGoogle() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  public async googleLoginCallback(@Res() res: Response, @Req() req) {
    const user = req.user.user;
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email })
    
    console.log('Google user profile:', req.user);
    res.redirect(`http://localhost:3000/verification/google-callback?token=${accessToken}`);
  }

  @Get('/github/login')
  @UseGuards(GithubAuthGuard)
  public async loginWithGithub() {}

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req, @Res() res: Response) {
    const user = req.user.user
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email })
    return res.redirect(`http://localhost:3000/verification/github-callback?token=${accessToken}`);
  }

  @Post('/forgot-password')
  public async forgotPassword(@Body('email') email: string) {
    return this.usersService.forgotPassword(email);
  }

  @Post('/verify-otp')
  public async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    try {
      const result = await this.usersService.verifyOtp(email, otp);
      return {
        message: result.message,
        token: result.token
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('/reset-password')
  public async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(token, newPassword);
  }

  @Post('/login')
  @UseInterceptors(LoginUserInterceptor)
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }
}
