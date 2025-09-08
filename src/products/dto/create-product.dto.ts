import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsEnum
} from 'class-validator';

enum CategoryName {
  ELECTRONICS = 'ELECTRONICS',
  FASHION = 'FASHION',
  FOOD = 'FOOD',
  BOOKS = 'BOOKS',
  BEAUTY = 'BEAUTY',
  HOME = 'HOME',
  TOYS = 'TOYS',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

class CreateCategoryDto {
  @IsEnum(CategoryName, {
    message: 'name must be one of: ELECTRONICS, FASHION, FOOD, BOOKS, BEAUTY, HOME, TOYS, SPORTS, OTHER',
  })
  @IsNotEmpty()
  name: CategoryName;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  // @IsOptional()
  // @IsString({ each: true })
  // image?: string[];

  @IsNotEmpty()
  @IsObject()
  category: CreateCategoryDto;
}
