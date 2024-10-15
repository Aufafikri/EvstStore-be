import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    public async getAllUsers() {
        return this.prisma.user.findMany({
            include: {
                Merchant: true
            }
        })
    }
    
    public async createAdmin(createUserDto: CreateUserDto) {
        const { confirmPassword, ...adminData } = createUserDto

        if (createUserDto.password !== confirmPassword) {
            throw new Error('Password confirmation does not match');
        }

        const salt = 10
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

        return this.prisma.user.create({
            data: {
                ...adminData,
                password: hashedPassword,
                role: 'ADMIN',
                isVerified: true
            }
        })
    }

    public async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                Merchant: true
            }
        })
    }
}
