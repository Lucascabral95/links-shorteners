import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class WhereGetLinkDto {
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === true || value === false) return value;
        return undefined;
    })
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === true || value === false) return value;
        return undefined;
    })
    isPublic?: boolean;

    originalUrl?: {
        contains: string;
        mode: 'insensitive';
    };

    title?: {
        contains: string;
        mode: 'insensitive';
    };

    customAlias?: {
        contains: string;
        mode: 'insensitive';
    };

    alias?: {
        contains: string;
        mode: 'insensitive';
    };

    userId?: string;
}