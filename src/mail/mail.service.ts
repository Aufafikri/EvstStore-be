import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto'

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private generateTokenVerification(userId: string): string {
    const payload = {
      userId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    console.log(`Generated Token: ${token}`);
    
    return token;
  }

  public async generateResetToken(userId: string): Promise<string> {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  }
  
  public async sendVerificationEmail(email: string, userId: string) {
    const verificationToken = this.generateTokenVerification(userId);
    const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;

    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Welcome! Please Verify Your Email Address!',
        html: `
            <div style="border: 2px solid gray; padding: 20px; border-radius: 10px;">
            <h1>👋 Welcome to EvstStore!</h1>
            <p style="font-weight: bold;" >To complete your registration, please verify your email address by clicking the link below:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Verifiy Email
            </a>
            <p>Thanks for registration on my ecommerce application! 😊</p>
            </div>
            `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send verification email');
    }
  }
 
  public async sendResetPasswordEmail(email: string, resetToken: string) {
    const resetLink = `http://localhost:5000/auth/reset-password?token=${resetToken}`;

    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="border: 2px solid gray; padding: 20px; border-radius: 10px;">
            <h1>🔒 Password Reset Request</h1>
            <p style="font-weight: bold;">We received a request to reset your password. Please click the link below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Reset Password
            </a>
            <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
            `,
      });
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      throw new Error('Failed to send reset password email');
    }
  }

  public async sendOtpEmail(email: string, otp: string) {
    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Your Password Reset OTP Code',
        html: `
          <div style="border: 2px solid gray; padding: 20px; border-radius: 10px;">
            <h1>🔒 Password Reset Request</h1>
            <p>Use the OTP code below to reset your password:</p>
            <h2 style="font-size: 24px; font-weight: bold;">${otp}</h2>
            <p>This OTP code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
