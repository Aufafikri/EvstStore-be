import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, CloudinaryService],
  exports: [AuthService]
})

export class AuthModule {}