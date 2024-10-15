import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as UserRoles } from '../auth/roles/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.Admin)
  @Post()
  public async createAdmin(@Body() createUserDto: CreateUserDto ) {
    return this.adminService.createAdmin(createUserDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Admin)
  @Get('/profile/:userId')
  public async getProfile(@Param('userId') userId: string ) {
    return this.adminService.getProfile(userId)
  }
}
