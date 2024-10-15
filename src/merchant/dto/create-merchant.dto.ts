import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  storeName: string;

  @IsString()
  storeDescription: string;

  // @IsOptional()
  // @IsString()
  // merchantImage?: string;
}
