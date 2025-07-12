import { Click } from "generated/prisma";
import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetLinksDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    originalUrl: string;

    @ApiProperty()
    @IsString()
    shortCode: string;

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

    @ApiProperty()
    @IsArray()
    @IsOptional()
    clicks?: Click[];

    @ApiProperty()
    @IsDate()
    created_at?: Date = new Date();

    @ApiProperty()
    @IsDate()
    updated_at?: Date = new Date();
}