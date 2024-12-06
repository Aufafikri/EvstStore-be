import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '60m' })
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' })

    await this.prisma.refreshToken.create({
        data: {
            token: refresh_token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
    })

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      // isVerified: user.isVerified
    };
  }
  
  public async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const { sub: userId } = decoded;

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload = { sub: userId };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async loginWithGoogle(profile: any) {
    console.log(profile)
     const { id, emails, displayName, photos } = profile;

     const email = emails[0].value
     const photo = photos && photos.length > 0 ? photos[0].value : null;

    //  const fullName = name.givenName && name.familyName
    // ? `${name.givenName} ${name.familyName}`
    // : name.displayName || "No Name Provided"; 

     // Debug log to verify email
     console.log("Email:", email);
   
     if (!email) {
       throw new Error("Email not found in Google profile");
     }

    // Find or create the user based on Google profile
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: id,
          email,
          name: displayName,
          profileImage: photo,
          isVerified: true,
        },
      });
    }

    // Create JWT payload
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '60m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Return tokens
    return { access_token: accessToken, refresh_token: refreshToken };
  //   console.log('Profile received:', profile);

  //   if (profile.emails && profile.emails.length > 0) {
  //     email = profile.emails[0].value;
  //   } else {
  //     throw new Error('Email not found in profile');
  //   }

  //   if (profile.photos && profile.photos.length > 0) {
  //     profileImage = profile.photos[0].value;
  //   } else {
  //     throw new Error('Profile image not found in profile');
  //   }
    
  //   console.log('Email extracted:', email);

  //   if (!email) {
  //     throw new Error('Email not found in profile');
  // }

  //   let user = await this.prisma.user.findUnique({
  //     where: {
  //       googleId: profile.id
  //     }
  //   })

  //   if(!user) {
  //     user = await this.prisma.user.create({
  //       data: {
  //         googleId: profile.id,
  //         email: email,
  //         name: profile.displayName,
  //         profileImage: profileImage,
  //         isVerified: true,
  //       },
  //     });
  //   }

  //   const payload = {
  //     sub: user.id,
  //     email: user.email
  //   }

  //   const accessToken = this.jwtService.sign(payload, { expiresIn: '60m' });
  //   const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  //   return { access_token: accessToken, refresh_token: refreshToken };
  
  }
}
