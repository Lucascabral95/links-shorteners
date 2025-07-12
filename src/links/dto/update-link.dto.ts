import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export class UpdateLinkDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    originalUrl?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    shortCode?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    customAlias?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    expiresAt?: Date;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    category?: string;
}
