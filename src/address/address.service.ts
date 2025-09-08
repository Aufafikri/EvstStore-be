import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) {}

    public async getAllAddress() {
        return this.prisma.address.findMany({})
    }

    public async getAddressById(addressId: string) {
        return this.prisma.address.findUnique({
            where: {
                id: addressId
            }
        })
    }

    public async getAddressByUserId(userId: string) {
        return this.prisma.address.findMany({
            where: {
                userId
            }
        })
    }

    public async createNewAddress(createAddressDto: CreateAddressDto) {
        return this.prisma.address.create({
            data: {
                ...createAddressDto
            }
        })
    }

    public async deleteAddress(addressId: string) {
        try {
            return await this.prisma.address.delete({
              where: { id: addressId },
            });
          } catch (error) {
            if (error.code === 'P2025') { 
              throw new HttpException({
                status: 'Delete address error',
                message: 'Address not found. Please check or ensure the ID is correct.',
              }, HttpStatus.NOT_FOUND);
            }
            throw new HttpException({
              status: 'Internal server error',
              message: 'An error occurred while deleting the address.',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }

    public async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto) {
        return this.prisma.address.update({
            where: {
                id: addressId
            },
            data: {
                ...updateAddressDto
            }
        })
    }
}
