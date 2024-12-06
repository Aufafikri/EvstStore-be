import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionBca {
    @IsNotEmpty()
    @IsNumber()
    grossAmount: number;

    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNumber()
    productPrice: number;

    @IsNumber()
    quantity: number;
}