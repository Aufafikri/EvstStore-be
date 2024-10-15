import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { User } from '@prisma/client';

@Injectable()
export class MerchantService {
    constructor(private readonly prisma: PrismaService) {}

    public async getAllMerchantsForAdmin(user: User) {
        if(user.role !== 'ADMIN') {
            throw new Error('Access Denied')
        }
        
        return this.prisma.merchant.findMany({})
    }

    public async getMerchantUserId(userId: string) {
        return this.prisma.merchant.findUnique({
            where: {
                userId
            }
        })
    }

    public async createMerchant(createMerchantDto: CreateMerchantDto, userId: string, imagePath: string) {
        console.log('Received image path:', imagePath); // Log the image path
        console.log('Received DTO:', createMerchantDto);
        return this.prisma.merchant.create({
            data: {
                storeName: createMerchantDto.storeName,
                storeDescription: createMerchantDto.storeDescription,
                userId,
                image: imagePath || null
            }
        })
    }
}
