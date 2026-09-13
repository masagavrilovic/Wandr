import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    firstName?: string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    lastName?: string;
}