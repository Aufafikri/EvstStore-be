import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  public async getAllUsers() {
    return this.prisma.user.findMany({});
  }

  public async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Merchant: true,
        Address: true
      }
    });

    if(user && user.avatar) {
      user.avatar = `http://localhost:5000/${user.avatar.replace(/\\/g, '/')}` 
  }

    return user
  }

  public async getUserByEmail(userEmail: string) {
    if (!userEmail) {
      throw new Error('Email is required');
    }
    
    return this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
  }

  public async createUser(dataUser: CreateUserDto) {
    const { confirmPassword, ...userData } = dataUser;
    const salt = 10;
    const hashedPassword = await bcrypt.hash(dataUser.password, salt);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isVerified: false,
        role: 'USER'
      },
    });

    await this.mailService.sendVerificationEmail(user.email, user.id);

    return {
      message:
        'Registration successful. Please check your email for verification.',
    };
  }

  public async verifyEmail(token: string): Promise<string> {
    try {
      console.log(`Received Token: ${token}`);
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        return 'Email is already verified';
      }

      await this.prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          isVerified: true,
        },
      });

      return 'Email verified successfully';
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error('Invalid or expired token');
    }
  }

  // public async updateUserProfile(userId: string, updateUserDto: UpdateUserDto) {
  //   return this.prisma.user.update({
  //     where: {
  //       id: userId
  //     },
  //     data: {
  //       profileImage: updateUserDto.profileImage || undefined
  //     }
  //   })
  // }

  public async updateProfileName(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: updateUserDto.name
      }
    })
  }

  // public async updateProfileImage(userId: string, updateUserDto: UpdateUserDto) {
  //   return this.prisma.user.update({
  //     where: {
  //       id: userId
  //     },
  //     data: {
  //       profileImage: updateUserDto.profileImage || undefined || null
  //     }
  //   })
  // }

  public async updateAvatarImage(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if(!user) throw new NotFoundException('user not found')

    const result = await this.cloudinaryService.uploadImage(file)

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: result.secure_url
      }
    })
  }

  public async deleteProfileImage(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: null
      }
    })
  }

  public async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId
      }
    })
  }

  public async forgotPassword(email: string) {
    const user = await this.getUserByEmail(email)
    if(!user) {
      throw new Error('User with this email does not exist');
    }

    const otp = this.generateOtp()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await this.prisma.otp.create({
      data: {
        otp,
        userId: user.id,
        expiresAt: otpExpires
      }
    })

    await this.mailService.sendOtpEmail(email, otp)

    return { 
      message: 'OTP sent to your email address' 
    }
  }

  public async validateOtp(email: string, otp: string) {
    const user = await this.getUserByEmail(email);

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (!user.otpCode || user.otpCode !== otp || user.otpExpires < new Date()) {
    throw new BadRequestException('Invalid or expired OTP KINGS');
  }

  return { message: 'OTP is valid' };
  }

  public async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Otp: true
      },
    });
  
    if (!user) {
      throw new BadRequestException('User not found');
    }

    console.log(`User found: ${user.id}`);
   
    try {
      const validOtp = await this.prisma.otp.findFirst({
        where: {
          userId: user.id,
          otp, 
          expiresAt: { gt: new Date() }, 
        },
      });

      console.log('OTP in DB:', validOtp);
      console.log('Expires At:', validOtp?.expiresAt);
    
      if (!validOtp) {
        throw new BadRequestException('Invalid or expired OTP, request new one');
      }
  
      console.log(`Valid OTP found: ${validOtp.id}`);
    
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true, 
        },
      });
  
      console.log(`User verified: ${user.id}`);
  
      await this.prisma.otp.delete({
        where: { id: validOtp.id },
      });
  
      console.log(`OTP deleted: ${validOtp.id}`);
  
      const token = this.jwtService.sign({ id: user.id, email: user.email })
      console.log(`Generated Token: ${token}`)
    
      return { 
        message: 'OTP is valid',
        token: token || 'failed generate token' 
      };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new BadRequestException('An error occurred while verifying OTP');
    }
  }
  
  public async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    const user = await this.getUserByEmail(email);
    if (!user || user.otpCode !== otp || user.otpExpires < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const validOtp = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await this.prisma.otp.delete({
      where: { id: validOtp.id },
    });

    return { message: 'Password has been reset successfully' };
  }

  public async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token)

      const userId = payload.id

      if (!userId) {
        throw new BadRequestException('Invalid token payload cik');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { 
        message: 'Password has been reset successfully' 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Invalid or expired token');
    }
  }

  public async validateResetToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
  
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return { 
        message: 'Token is valid', 
        userId: user.id 
      };
      
    } catch (error) {
      console.error('Error validating token:', error);
      throw new Error('Invalid or expired token');
    }
  }

  public async updatePhoneNumber(id: string, updateProfilePhone: UpdateUserDto) {
    const { phoneNumber } = updateProfilePhone
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        phone: phoneNumber
      }
    })
  }

  public async deleteAccountById(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId
      }
    })
  }

  public async deletePhoneNumber(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        phone: null
      }
    })
  }
}
