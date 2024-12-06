import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    name?: string

    @IsString()
    @IsOptional()
    profileImage?: string

    @IsString()
    @IsOptional()
    phoneNumber?: number
}