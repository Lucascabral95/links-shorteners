import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class PaginationLinkDto {
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
    search?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    customAlias?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === true || value === false) return value;
        return undefined;
    })
    isActive?: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === true || value === false) return value;
        return undefined;
    })
    isPublic?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;
}