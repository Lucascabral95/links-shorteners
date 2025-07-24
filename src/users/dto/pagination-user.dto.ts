import { Role } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsNumber, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class PaginationUserDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    full_name?: string;

    @ApiProperty()
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    verified?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    provider?: string;
}