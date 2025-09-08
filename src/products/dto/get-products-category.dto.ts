import { IsEnum, IsOptional } from "class-validator";
import { CategoryName } from "@prisma/client"; // enum yang ada di schema.prisma

export class GetProductsDto {
  @IsOptional()
  @IsEnum(CategoryName)
  category?: CategoryName;
}
