import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLinkDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    originalUrl: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
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
}
