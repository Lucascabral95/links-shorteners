import { IsOptional, IsString } from "class-validator";

export class WhereClicksDto {
    @IsString()
    @IsOptional()
    country?: { contains: string; mode: 'insensitive' };

    @IsString()
    @IsOptional()
    city?: { contains: string; mode: 'insensitive' };

    @IsString()
    @IsOptional()
    device?: { contains: string; mode: 'insensitive' };

    @IsString()
    @IsOptional()
    browser?: { contains: string; mode: 'insensitive' };

    @IsString()
    @IsOptional()
    userId?: string;
}