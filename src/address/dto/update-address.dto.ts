import { IsNotEmpty, IsOptional, IsPostalCode, IsString, Length } from "class-validator";

export class UpdateAddressDto {
    @IsString()
    country: string;
    
    @IsString()
    province: string;
    
    @IsString()
    city: string;

    @IsString()
    district?: string;
    
    @IsString()
    subdistrict: string;
    
    @IsPostalCode('any')
    zipCode: string;

    @IsString()
    street: string;
  
    @IsString()
    @IsNotEmpty()
    userId: string;  
}