import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateAddressInterceptor } from './interceptor/create-address.interceptor';
import { GetAllAddressInterceptor } from './interceptor/getAll-address.interceptor';
import { GetAddressByIdInterceptor } from './interceptor/getById-address.interceptor';
import { DeleteAddressInterceptor } from './interceptor/delete-address.interceptor';
import { GetAddressByUserIdInterceptor } from './interceptor/getbyUserId-address.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseInterceptors(GetAllAddressInterceptor)
  @Get()
  public async getAllAddress() {
    return this.addressService.getAllAddress()
  }

  @UseInterceptors(GetAddressByIdInterceptor)
  @Get('/:addressId')
  public async getAddressById(@Param('addressId') addressId: string ) {
    return this.addressService.getAddressById(addressId)
  }

  @UseInterceptors(GetAddressByUserIdInterceptor)
  @Get('/user/:userId')
  public async getAddressByUserId(@Param('userId') userId: string ) {
    return this.addressService.getAddressByUserId(userId)
  }

  @UseInterceptors(CreateAddressInterceptor)
  @Post()
  public async createNewAddress(@Body() createAddressDto: CreateAddressDto ) {
    return this.addressService.createNewAddress(createAddressDto)
  }

  @UseInterceptors(DeleteAddressInterceptor)
  @Delete('/:addressId')
  public async deleteAddress(@Param('addressId') addressId: string ) {
    return this.addressService.deleteAddress(addressId)
  }

  @Put('/:addressId')
  public async updateAddress(@Param('addressId') addressId: string, @Body() updateAddressDto: UpdateAddressDto  ) {
    return this.addressService.updateAddress(addressId, updateAddressDto)
  }
}
