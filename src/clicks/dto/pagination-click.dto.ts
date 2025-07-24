import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class PaginationClickDto {
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
    country?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    device?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    browser?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;
}