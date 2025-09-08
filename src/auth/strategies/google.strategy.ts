import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/lib/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, id, displayName, photos } = profile

    const existingUser = await this.prisma.user.findUnique({
      where: {
        googleId: id
      }
    })
    
    if (existingUser) {
      const payload = {
        user: existingUser,
        accessToken
      };
      return done(null, payload)
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          googleId: id,
          email: emails[0].value,
          name: displayName,
          avatar: photos[0].value,
          isVerified: true,
          loginMethod: 'GOOGLE',
        }
      });
  
      const payload = {
        user: newUser,
        accessToken
      };
  
      done(null, payload)
  }
}
}
