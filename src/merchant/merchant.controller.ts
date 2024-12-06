import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UploadProfileImage } from 'src/decorators/uploadProfileImage';
import { UploadMerchantImage } from 'src/decorators/uploadMerchantImage';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile/:userId')
  public async getMerchantUserId(@Param('userId') userId: string ) {
    const merchant = await this.merchantService.getMerchantUserId(userId);
    if (!merchant) {
        throw new NotFoundException('Merchant not found');
    }
    return merchant;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/product/:merchantId')
  public async getMerchantById(@Param('merchantId') merchantId: string ) {
    return this.merchantService.getMerchantById(merchantId)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UploadMerchantImage()
  public async createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;

    const imagePath = image
      ? `/uploads/merchant-images/${image.filename}`
      : null;
    return this.merchantService.createMerchant(
      createMerchantDto,
      userId,
      imagePath,
    );
  }
}
