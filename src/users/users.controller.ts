import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Request, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UploadProfileImage } from 'src/decorators/uploadProfileImage';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
// @SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAllUsers() {
    return this.usersService.getAllUsers()
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  public async getUserProfile(@Request() req: any) {
    return await this.usersService.getUserById(req.user.id);

    // if(!userProfile.isVerified) {
    //   throw new UnauthorizedException('user is not verified')
    // }
    
    // return userProfile;
  }

  @Get('/:userId')
  public async getUserById(@Param("userId") userId: string ) {
    return this.usersService.getUserById(userId)
  }

  @Get('/register/:email')
  public async getOneEmailUser(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post('/register')
  public async createUser(@Body() dataUser: CreateUserDto ) {
    return this.usersService.createUser(dataUser)
  }

  // @UseGuards(JwtAuthGuard)
  // @Put('/profile/:userId') 
  // @UploadProfileImage()
  // public async updateUserProfile(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() profileImage: Express.Multer.File ) {
  //   return this.usersService.updateUserProfile(userId, {
  //     ...updateUserDto,
  //     profileImage: profileImage?.path
  //   })
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  @UseInterceptors(FileInterceptor("file"))
  public async updateAvatarImage(@Req() req, @UploadedFile() file: Express.Multer.File ) {
    const userId = req.user.id
    return this.usersService.updateAvatarImage(userId, file)
  }


  // @UseGuards(JwtAuthGuard)
  // @Patch('/profile/image/:userId')
  // @UploadProfileImage()
  // public async updateProfileImage(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() profileImage: Express.Multer.File  ) {
  //   if (!profileImage) {
  //     console.error('No file uploaded');
  //     throw new Error('No file uploaded');
  //   }

  //   console.log('Received file:', profileImage);
  //   console.log('File path:', profileImage?.path);
  //   return this.usersService.updateProfileImage(userId, {
  //     profileImage: profileImage?.path
  //   })
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/name/:userId')
  public async updateProfileName(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto ) {
    return this.usersService.updateProfileName(userId, { name: updateUserDto.name })
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/delete/profile/image/:userId')
  public async deleteProfileImage(@Param('userId') userId: string) {
    return this.usersService.deleteProfileImage(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile/phone/:userId') 
  public async updateProfilePhone(@Param('userId') userId: string, @Body() updateProfilePhone: UpdateUserDto  ) {
    console.log(updateProfilePhone)
    return this.usersService.updatePhoneNumber(userId, { phoneNumber: updateProfilePhone.phoneNumber })
  }
  

  // @UseGuards(JwtAuthGuard)
  // @Delete('/delete-account/:userId')
  // public async deleteUser(@Param('userId') userId: string ) {
  //   return this.usersService.deleteUser(userId)
  // }
  
  @UseGuards(JwtAuthGuard)
  @Patch('/phone/number/:userId')
  public async deletePhoneNumber(@Param("userId") userId: string) {
    console.log(this.deletePhoneNumber)
    return this.usersService.deletePhoneNumber(userId)
  }

  @Delete('/asli/:userId')
  public async deleteUserAccountById(@Param('userId') userId: string ){
    return this.deleteUserAccountById(userId)
  }

}