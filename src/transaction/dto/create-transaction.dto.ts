import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsNumber()
    @IsNotEmpty()
    grossAmount: number;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsNumber()
    quantity: number;

    @IsString()
    productName: string;

    @IsNumber()
    productPrice: number;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    merchantName: string;

    @IsString()
    addressId: string;

    @IsString()
    addressCity: string;

    @IsString()
    addressCountry: string;
}